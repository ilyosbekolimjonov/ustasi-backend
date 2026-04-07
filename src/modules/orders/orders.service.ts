import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderStatus, TimeUnit, UserRole } from '../../common/constants/domain.enums';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { toNumber } from '../../common/utils/number.util';
import { TelegramService } from '../../integrations/telegram/telegram.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PrismaService } from '../../prisma/prisma.service';

const orderInclude = {
  orderProducts: true,
  user: {
    select: {
      id: true,
      fullname: true,
      email: true,
      phone: true,
    },
  },
} satisfies Prisma.OrderInclude;

type OrderRecord = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const pricedItems = await Promise.all(
      dto.orderItems.map(async (item) => {
        const pricing = await this.resolvePricing(
          item.professionId,
          item.levelId,
          item.toolId,
          item.timeUnit,
        );

        return {
          ...item,
          price: pricing.unitPrice,
          lineTotal:
            pricing.type === 'tool'
              ? pricing.unitPrice * item.count
              : pricing.unitPrice * item.count * item.workingTime,
        };
      }),
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        address: dto.address,
        longitude: dto.longitude,
        latitude: dto.latitude,
        date: dto.date,
        paymentType: dto.paymentType,
        withDelivery: dto.withDelivery,
        deliveryComment: dto.deliveryComment,
        totalPrice: pricedItems.reduce((sum, item) => sum + item.lineTotal, 0),
        orderProducts: {
          create: pricedItems.map(({ lineTotal, ...item }) => item),
        },
      },
      include: orderInclude,
    });

    await this.telegramService.sendMessage(
      [
        '<b>New Order</b>',
        '',
        `ID: <code>${order.id}</code>`,
        `Client: ${this.escapeHtml(order.user.fullname)}`,
        `Phone: ${this.escapeHtml(order.user.phone)}`,
        `Total: ${toNumber(order.totalPrice)} UZS`,
        `Status: ${this.escapeHtml(this.formatOrderStatus(order.status))}`,
      ].join('\n'),
    );

    return this.mapOrder(order);
  }

  async findMine(userId: string, query: PaginationQueryDto) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.mapOrder(order));
  }

  async findAllForAdmin(query: PaginationQueryDto & { status?: string }) {
    const orders = await this.prisma.order.findMany({
      where: query.status ? { status: query.status as OrderRecord['status'] } : undefined,
      include: orderInclude,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.mapOrder(order));
  }

  async findOne(userId: string, role: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role === UserRole.USER_FIZ || role === UserRole.USER_YUR) {
      if (order.userId !== userId) {
        throw new ForbiddenException('You cannot access this order');
      }
    }

    return this.mapOrder(order);
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
      include: orderInclude,
    });

    await this.telegramService.sendMessage(
      [
        '<b>Order Updated</b>',
        '',
        `ID: <code>${order.id}</code>`,
        `New Status: ${this.escapeHtml(this.formatOrderStatus(order.status))}`,
        `Updated At: ${this.escapeHtml(this.formatDateTime(order.updatedAt))}`,
      ].join('\n'),
    );

    return this.mapOrder(order);
  }

  async update(userId: string, role: string, orderId: string, dto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role === UserRole.USER_FIZ || role === UserRole.USER_YUR) {
      if (order.userId !== userId) {
        throw new ForbiddenException('You cannot update this order');
      }
    }

    // We intentionally keep order items, computed totals, and lifecycle status immutable here.
    // Those fields depend on server-side pricing rules and dedicated workflow endpoints.
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        address: dto.address,
        longitude: dto.longitude,
        latitude: dto.latitude,
        date: dto.date,
        paymentType: dto.paymentType,
        withDelivery: dto.withDelivery,
        deliveryComment: dto.deliveryComment,
      },
      include: orderInclude,
    });

    return this.mapOrder(updatedOrder);
  }

  async remove(userId: string, role: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role === UserRole.USER_FIZ || role === UserRole.USER_YUR) {
      if (order.userId !== userId) {
        throw new ForbiddenException('You cannot delete this order');
      }
    }

    await this.prisma.order.delete({
      where: { id: orderId },
    });
    return { message: 'Order deleted successfully' };
  }

  private async resolvePricing(
    professionId?: string,
    levelId?: string,
    toolId?: string,
    timeUnit?: CreateOrderDto['orderItems'][number]['timeUnit'],
  ) {
    if (toolId) {
      const tool = await this.prisma.tool.findUnique({
        where: { id: toolId },
        select: { price: true },
      });

      if (!tool) {
        throw new NotFoundException('Tool not found');
      }

      return {
        type: 'tool' as const,
        unitPrice: Number(tool.price),
      };
    }

    if (!professionId || !levelId || !timeUnit) {
      throw new NotFoundException('Profession pricing source is incomplete');
    }

    const professionLevel = await this.prisma.professionLevel.findFirst({
      where: {
        professionId,
        levelId,
      },
      select: {
        priceHourly: true,
        priceDaily: true,
      },
    });

    if (!professionLevel) {
      throw new NotFoundException('Profession and level pricing not found');
    }

    return {
      type: 'profession' as const,
      unitPrice:
        timeUnit === TimeUnit.DAY
          ? Number(professionLevel.priceDaily)
          : Number(professionLevel.priceHourly),
    };
  }

  private mapOrder(order: OrderRecord) {
    return {
      id: order.id,
      userId: order.userId,
      user: order.user,
      address: order.address,
      longitude: order.longitude,
      latitude: order.latitude,
      date: order.date,
      totalPrice: toNumber(order.totalPrice),
      paymentType: order.paymentType,
      withDelivery: order.withDelivery,
      status: order.status,
      deliveryComment: order.deliveryComment,
      items: order.orderProducts.map((item) => ({
        ...item,
        price: toNumber(item.price),
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private formatOrderStatus(status: OrderStatus) {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  private formatDateTime(value: Date) {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Asia/Tashkent',
    }).format(value);
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
