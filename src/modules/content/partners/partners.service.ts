import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPartnerDto: CreatePartnerDto) {
    try {
      let created = await this.prisma.partner.create({
        data: {
          nameUz: createPartnerDto.name_uz,
          nameRu: createPartnerDto.name_ru,
          nameEn: createPartnerDto.name_en,
          image: createPartnerDto.image,
          link: createPartnerDto.link,
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
      let partners = await this.prisma.partner.findMany({
        where: {
          OR: [
            {
              nameEn: {
                startsWith: search,
                mode: "insensitive"
              }
            },
            {
              nameRu: {
                startsWith: search,
                mode: "insensitive"
              }
            },
            {
              nameUz: {
                startsWith: search,
                mode: "insensitive"
              }
            }
          ]
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber
      })
      return partners
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let partner = await this.prisma.partner.findUnique({ where: { id } })
      if (!partner) throw new NotFoundException("Not found")
      return partner
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    try {
      let updated = await this.prisma.partner.update({
        data: {
          nameUz: updatePartnerDto.name_uz,
          nameRu: updatePartnerDto.name_ru,
          nameEn: updatePartnerDto.name_en,
          image: updatePartnerDto.image,
          link: updatePartnerDto.link,
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
      let deleted = await this.prisma.partner.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

