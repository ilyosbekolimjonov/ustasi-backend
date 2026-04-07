import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCapasityDto } from './dto/create-capasity.dto';
import { UpdateCapasityDto } from './dto/update-capasity.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CapasityService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCapasityDto: CreateCapasityDto) {
    try {
      let created = await this.prisma.capacity.create({
        data: {
          nameUz: createCapasityDto.name_uz,
          nameRu: createCapasityDto.name_ru,
          nameEn: createCapasityDto.name_en,
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
      console.log(search);

      let capasities = await this.prisma.capacity.findMany({
        where: {
          OR: [
            { nameEn: { startsWith: search, mode: "insensitive" } },
            { nameRu: { startsWith: search, mode: "insensitive" } },
            { nameUz: { startsWith: search, mode: "insensitive" } },
          ]
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          tools: true
        }
      })
      return capasities
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let capasity = await this.prisma.capacity.findUnique({
        where: { id },
        include: {
          tools: true
        }
      })
      if (!capasity) throw new NotFoundException("Not found")
      return capasity
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateCapasityDto: UpdateCapasityDto) {
    try {
      let updated = await this.prisma.capacity.update({
        data: {
          nameUz: updateCapasityDto.name_uz,
          nameRu: updateCapasityDto.name_ru,
          nameEn: updateCapasityDto.name_en,
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
      let deleted = await this.prisma.capacity.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

