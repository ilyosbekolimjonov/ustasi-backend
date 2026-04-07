import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMasterProfessionDto } from './dto/create-master-profession.dto';
import { UpdateMasterProfessionDto } from './dto/update-master-profession.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MasterProfessionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMasterProfessionDto: CreateMasterProfessionDto) {
    try {
      let masterProfession = await this.prisma.masterProfession.create({ data: createMasterProfessionDto })
      return masterProfession
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      let masterProfessions = await this.prisma.masterProfession.findMany({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          level: true,
          master: true,
          profession: true
        }
      })
      return masterProfessions
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let masterProfession = await this.prisma.masterProfession.findUnique({
        where: { id },
        include: {
          level: true,
          master: true,
          profession: true
        }
      })
      if (!masterProfession) throw new NotFoundException("not found")
      return masterProfession
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateMasterProfessionDto: UpdateMasterProfessionDto) {
    try {
      let updated = await this.prisma.masterProfession.update({
        data: updateMasterProfessionDto,
        where: { id }
      })
      return updated
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prisma.masterProfession.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

