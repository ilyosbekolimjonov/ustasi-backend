import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact_us.dto';
import { UpdateContactUsDto } from './dto/update-contact_us.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ContactUsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createContactUsDto: CreateContactUsDto) {
    try {
      let created = await this.prisma.contactUs.create({
        data: {
          firstName: createContactUsDto.firstname,
          lastName: createContactUsDto.lastname,
          phone: createContactUsDto.phone,
          address: createContactUsDto.address,
          message: createContactUsDto.message,
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

      let findAll = await this.prisma.contactUs.findMany({
        where: {
          OR: [
            { firstName: { startsWith: search, mode: "insensitive" } },
            { lastName: { startsWith: search, mode: "insensitive" } }
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
      let findOne = await this.prisma.contactUs.findUnique({ where: { id } })
      if (!findOne) throw new NotFoundException("Not found")
      return findOne
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateontactUsDto: UpdateContactUsDto) {
    try {
      let updated = await this.prisma.contactUs.update({
        data: {
          firstName: updateontactUsDto.firstname,
          lastName: updateontactUsDto.lastname,
          phone: updateontactUsDto.phone,
          address: updateontactUsDto.address,
          message: updateontactUsDto.message,
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
      let deleted = await this.prisma.contactUs.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

