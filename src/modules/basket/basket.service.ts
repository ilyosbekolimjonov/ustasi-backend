import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TimeUnit } from '../../common/constants/domain.enums';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { toNumber } from '../../common/utils/number.util';
import { CreateBasketItemDto } from './dto/create-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';
import { PrismaService } from '../../prisma/prisma.service';

const basketInclude = {
  profession: true,
  tool: true,
  level: true,
} satisfies Prisma.BasketInclude;

type BasketRecord = Prisma.BasketGetPayload<{ include: typeof basketInclude }>;

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBasketItemDto) {
    const duplicate = await this.prisma.basket.findFirst({
      where: {
        userId,
        professionId: dto.professionId,
        toolId: dto.toolId,
        levelId: dto.levelId,
        timeUnit: dto.timeUnit,
      },
      include: basketInclude,
    });

    if (duplicate) {
      return this.update(userId, duplicate.id, {
        count: duplicate.count + dto.count,
        workingTime: dto.workingTime,
      });
    }

    const item = await this.prisma.basket.create({
      data: {
        userId,
        ...dto,
      },
      include: basketInclude,
    });

    return this.mapBasketItem(item);
  }

  async findMine(userId: string, query: PaginationQueryDto) {
    const items = await this.prisma.basket.findMany({
      where: { userId },
      include: basketInclude,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Promise.all(items.map((item) => this.mapBasketItem(item)));
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.basket.findFirst({
      where: { id, userId },
      include: basketInclude,
    });

    if (!item) {
      throw new NotFoundException('Basket item not found');
    }

    return this.mapBasketItem(item);
  }

  async update(userId: string, id: string, dto: UpdateBasketItemDto) {
    const existing = await this.prisma.basket.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Basket item not found');
    }

    const item = await this.prisma.basket.update({
      where: { id },
      data: dto,
      include: basketInclude,
    });
    return this.mapBasketItem(item);
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.basket.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Basket item not found');
    }

    await this.prisma.basket.delete({
      where: { id },
    });
    return { message: 'Basket item deleted successfully' };
  }

  private async mapBasketItem(item: BasketRecord) {
    const [tool, professionLevel] = await Promise.all([
      this.prisma.tool.findUnique({
        where: { id: item.toolId },
        select: { price: true },
      }),
      this.prisma.professionLevel.findFirst({
        where: { professionId: item.professionId, levelId: item.levelId },
        select: {
          priceHourly: true,
          priceDaily: true,
        },
      }),
    ]);

    if (!tool || !professionLevel) {
      throw new NotFoundException('Basket references invalid pricing sources');
    }

    const professionUnitPrice =
      item.timeUnit === TimeUnit.DAY
        ? Number(professionLevel.priceDaily)
        : Number(professionLevel.priceHourly);
    const estimatedTotal =
      professionUnitPrice * item.count * item.workingTime +
      Number(tool.price) * item.count;

    return {
      id: item.id,
      profession: item.profession,
      tool: {
        ...item.tool,
        price: toNumber(item.tool.price),
      },
      level: item.level,
      count: item.count,
      timeUnit: item.timeUnit,
      workingTime: item.workingTime,
      estimatedTotal,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}

