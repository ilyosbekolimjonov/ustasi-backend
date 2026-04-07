import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createShowcaseDto: CreateShowcaseDto) {
    try {
      let created = await this.prisma.showcase.create({
        data: {
          nameUz: createShowcaseDto.name_uz,
          nameRu: createShowcaseDto.name_ru,
          nameEn: createShowcaseDto.name_en,
          descriptionUz: createShowcaseDto.description_uz,
          descriptionRu: createShowcaseDto.description_ru,
          descriptionEn: createShowcaseDto.description_en,
          image: createShowcaseDto.image,
          link: createShowcaseDto.link,
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
      let findAll = await this.prisma.showcase.findMany({
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
      return findAll
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let findOne = await this.prisma.showcase.findUnique({ where: { id } })
      if (!findOne) throw new NotFoundException("Not found")
      return findOne
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateShowcaseDto: UpdateShowcaseDto) {
    try {
      let updated = await this.prisma.showcase.update({
        data: {
          nameUz: updateShowcaseDto.name_uz,
          nameRu: updateShowcaseDto.name_ru,
          nameEn: updateShowcaseDto.name_en,
          descriptionUz: updateShowcaseDto.description_uz,
          descriptionRu: updateShowcaseDto.description_ru,
          descriptionEn: updateShowcaseDto.description_en,
          image: updateShowcaseDto.image,
          link: updateShowcaseDto.link,
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
      let deleted = await this.prisma.showcase.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

