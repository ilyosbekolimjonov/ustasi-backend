import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSizeDto: CreateSizeDto) {
    try {
      const created = await this.prisma.size.create({
        data: {
          nameUz: createSizeDto.name_uz,
          nameRu: createSizeDto.name_ru,
          nameEn: createSizeDto.name_en,
        },
      });
      return created;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page = 1, limit = 10, search = '') {
    try {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const sizes = await this.prisma.size.findMany({
        where: {
          OR: [
            {
              nameEn: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
            {
              nameRu: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
            {
              nameUz: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          tools: true,
        },
      });
      return sizes;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const size = await this.prisma.size.findUnique({
        where: { id },
        include: {
          tools: true,
        },
      });
      if (!size) throw new NotFoundException('Not found');
      return size;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    try {
      const updated = await this.prisma.size.update({
        data: {
          nameUz: updateSizeDto.name_uz,
          nameRu: updateSizeDto.name_ru,
          nameEn: updateSizeDto.name_en,
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
      const deleted = await this.prisma.size.delete({ where: { id } });
      return deleted;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
