import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createLevelDto: CreateLevelDto) {
    try {
      let created = await this.prisma.level.create({
        data: {
          nameUz: createLevelDto.name_uz,
          nameRu: createLevelDto.name_ru,
          nameEn: createLevelDto.name_en,
        },
      })
      return created
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(page = 1, limit = 10, search = '') {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)
      let levels = await this.prisma.level.findMany({
        where: {
          OR: [
            { nameEn: { startsWith: search, mode: "insensitive" } },
            { nameRu: { startsWith: search, mode: "insensitive" } },
            { nameUz: { startsWith: search, mode: "insensitive" } },
          ]
        },
        include: {
          masterProfessions: true,
          professionLevels: true
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber
      })
      return levels
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let level = await this.prisma.level.findUnique({
        include: {
          masterProfessions: true,
          professionLevels: true
        },
        where: { id }
      })
      if (!level) throw new NotFoundException("Not found")
      return level
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    try {
      let updated = await this.prisma.level.update({
        data: {
          nameUz: updateLevelDto.name_uz,
          nameRu: updateLevelDto.name_ru,
          nameEn: updateLevelDto.name_en,
        },
        where: { id }
      })
      return updated
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prisma.level.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

