import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAboutUsDto } from './dto/create-about_us.dto';
import { UpdateAboutUsDto } from './dto/update-about_us.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AboutUsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAboutUsDto: CreateAboutUsDto) {
    try {
      let created = await this.prisma.aboutUs.create({
        data: {
          generalInformationUz: createAboutUsDto.generalInformation_uz,
          generalInformationRu: createAboutUsDto.generalInformation_ru,
          generalInformationEn: createAboutUsDto.generalInformation_en,
          email: createAboutUsDto.email,
          link: createAboutUsDto.link,
          phone: createAboutUsDto.phone,
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

      let findAll = await this.prisma.aboutUs.findMany({
        where: {
          OR: [
            {
              generalInformationEn: {
                startsWith: search,
                mode: "insensitive"
              }
            },
            {
              generalInformationRu: {
                startsWith: search,
                mode: "insensitive"
              }
            },
            {
              generalInformationUz: {
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
      let findOne = await this.prisma.aboutUs.findUnique({ where: { id } })
      if (!findOne) throw new NotFoundException("Not found")
      return findOne
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateAboutUsDto: UpdateAboutUsDto) {
    try {
      let updated = await this.prisma.aboutUs.update({
        data: {
          generalInformationUz: updateAboutUsDto.generalInformation_uz,
          generalInformationRu: updateAboutUsDto.generalInformation_ru,
          generalInformationEn: updateAboutUsDto.generalInformation_en,
          email: updateAboutUsDto.email,
          link: updateAboutUsDto.link,
          phone: updateAboutUsDto.phone,
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
      let deleted = await this.prisma.aboutUs.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

