import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProfessionLevelDto } from './dto/create-profession-level.dto';
import { UpdateProfessionLevelDto } from './dto/update-profession-level.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProfessionLevelService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProfessionLevelDto: CreateProfessionLevelDto) {
    try {
      let professionLevel = await this.prisma.professionLevel.create({ data: createProfessionLevelDto })
      return professionLevel
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      let professionLevels = await this.prisma.professionLevel.findMany({
        include: {
          level: true,
          profession: true
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      })
      return professionLevels
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let professionLevel = await this.prisma.professionLevel.findUnique({
        include: {
          level: true,
          profession: true
        },
        where: { id }
      })
      if (!professionLevel) throw new NotFoundException("Not found")
      return professionLevel
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateProfessionLevelDto: UpdateProfessionLevelDto) {
    try {
      let updated = await this.prisma.professionLevel.update({
        data: updateProfessionLevelDto,
        where: { id }
      })
      return updated
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      let removed = await this.prisma.professionLevel.delete({ where: { id } })
      return removed
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

