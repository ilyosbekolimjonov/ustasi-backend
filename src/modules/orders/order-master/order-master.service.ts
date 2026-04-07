import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderMasterDto } from './dto/create-order-master.dto';
import { UpdateOrderMasterDto } from './dto/update-order-master.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { ORDER_STATUS } from '../../../common/constants/legacy-prisma.enums';

@Injectable()
export class OrderMasterService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createOrderMasterDto: CreateOrderMasterDto) {
    try {
      let { orderId, masterIds } = createOrderMasterDto
      let orderMaster = await Promise.all(
        masterIds.map(masterId =>
          this.prisma.orderMaster.create({
            data: {
              orderId,
              masterId
            },
            include: {
              master: true,
            }
          })
        )
      )

      await this.prisma.order.update({
        data: { status: ORDER_STATUS.ACTIVE },
        where: { id: orderId }
      })

      await Promise.all(
        masterIds.map(masterId =>
          this.prisma.master.update({
            data: { isActive: true },
            where: { id: masterId }
          })
        )
      );
      return orderMaster
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      let orderMasters = await this.prisma.orderMaster.findMany({
        include: {
          master: true,
          order: true
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber
      })
      return orderMasters
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      let orderMaster = await this.prisma.orderMaster.findUnique({
        where: { id },
        include: {
          master: true,
          order: true
        },
      })
      if (!orderMaster) throw new NotFoundException("Not found")
      return orderMaster
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, updateOrderMasterDto: UpdateOrderMasterDto) {
    try {
      let updated = await this.prisma.orderMaster.update({
        data: updateOrderMasterDto,
        where: { id }
      })
      return updated
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prisma.orderMaster.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}

