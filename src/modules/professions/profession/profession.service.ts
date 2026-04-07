import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProfessionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProfessionDto: CreateProfessionDto) {
    try {
      let profession = await this.prisma.profession.create({
        data: {
          nameUz: createProfessionDto.name_uz,
          nameRu: createProfessionDto.name_ru,
          nameEn: createProfessionDto.name_en,
          image: createProfessionDto.image,
          isActive: createProfessionDto.isActive,
        },
      })
      return profession
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(page = 1, limit = 10, search = '', isActive = '') {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      let whereConditions: any = {
        OR: [
          { nameEn: { startsWith: search, mode: 'insensitive' } },
          { nameRu: { startsWith: search, mode: 'insensitive' } },
          { nameUz: { startsWith: search, mode: 'insensitive' } },
        ]
      }

      if (isActive != '') {
        let isAct = isActive == 'true' ? true : false
        whereConditions = {
          ...whereConditions,
          isActive: isAct
        }
      }

      let professions = await this.prisma.profession.findMany({
        include: {
          masterProfessions: true,
          professionLevels: true,
          professionTools: true,
          // Basket: true
        },
        where: whereConditions,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber
      })
      return professions
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let profession = await this.prisma.profession.findUnique({
        where: { id },
        include: {
          masterProfessions: true,
          professionLevels: true,
          professionTools: true,
          // Basket: true
        }
      })
      if (!profession) throw new NotFoundException("Not found")
      return profession
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateProfessionDto: UpdateProfessionDto) {
    try {
      let updated = await this.prisma.profession.update({
        data: {
          nameUz: updateProfessionDto.name_uz,
          nameRu: updateProfessionDto.name_ru,
          nameEn: updateProfessionDto.name_en,
          image: updateProfessionDto.image,
          isActive: updateProfessionDto.isActive,
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
      let deleted = await this.prisma.profession.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

