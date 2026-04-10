import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    try {
      const region = await this.prisma.region.create({
        data: {
          nameUz: createRegionDto.name_uz,
          nameRu: createRegionDto.name_ru,
          nameEn: createRegionDto.name_en,
        },
      });
      return region;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page = 1, limit = 10, search = '') {
    try {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const regions = await this.prisma.region.findMany({
        include: { users: true },
        where: {
          OR: [
            { nameEn: { startsWith: search, mode: 'insensitive' } },
            { nameRu: { startsWith: search, mode: 'insensitive' } },
            { nameUz: { startsWith: search, mode: 'insensitive' } },
          ],
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });
      return regions;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const region = await this.prisma.region.findUnique({
        include: { users: true },
        where: { id },
      });
      if (!region) throw new NotFoundException('Not found');
      return region;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    try {
      const updated = await this.prisma.region.update({
        data: {
          nameUz: updateRegionDto.name_uz,
          nameRu: updateRegionDto.name_ru,
          nameEn: updateRegionDto.name_en,
        },
        where: { id },
      });
      return updated;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const removed = await this.prisma.region.delete({ where: { id } });
      return removed;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
