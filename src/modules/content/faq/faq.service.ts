import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFaqDto: CreateFaqDto) {
    try {
      const created = await this.prisma.fAQ.create({
        data: {
          questionUz: createFaqDto.question_uz,
          questionRu: createFaqDto.question_ru,
          questionEn: createFaqDto.question_en,
          answerUz: createFaqDto.answer_uz,
          answerRu: createFaqDto.answer_ru,
          answerEn: createFaqDto.answer_en,
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
      const findAll = await this.prisma.fAQ.findMany({
        where: {
          OR: [
            {
              questionEn: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
            {
              questionRu: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
            {
              questionUz: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });
      return findAll;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.fAQ.findUnique({ where: { id } });
      if (!findOne) throw new NotFoundException('Not found');
      return findOne;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    try {
      const updated = await this.prisma.fAQ.update({
        data: {
          questionUz: updateFaqDto.question_uz,
          questionRu: updateFaqDto.question_ru,
          questionEn: updateFaqDto.question_en,
          answerUz: updateFaqDto.answer_uz,
          answerRu: updateFaqDto.answer_ru,
          answerEn: updateFaqDto.answer_en,
        },
        where: { id },
      });
      return updated;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.fAQ.delete({ where: { id } });
      return deleted;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
