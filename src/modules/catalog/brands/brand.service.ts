import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createBrandDto: CreateBrandDto) {
    try {
      let created = await this.prisma.brand.create({
        data: {
          nameUz: createBrandDto.name_uz,
          nameRu: createBrandDto.name_ru,
          nameEn: createBrandDto.name_en,
        },
      })
      return created
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async findAll(page = 1, limit = 10, search = '') {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      let brands = await this.prisma.brand.findMany({
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
      return brands
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async findOne(id: string) {
    try {
      let brand = await this.prisma.brand.findUnique({
        where: { id },
        include: {
          tools: true
        }
      })
      if (!brand) throw new NotFoundException("Not founed")
      return brand
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    try {
      let updated = await this.prisma.brand.update({
        data: {
          nameUz: updateBrandDto.name_uz,
          nameRu: updateBrandDto.name_ru,
          nameEn: updateBrandDto.name_en,
        },
        where: { id }
      })
      return updated
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async remove(id: string) {
    try {
      let removed = await this.prisma.brand.delete({ where: { id } })
      return removed
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}

