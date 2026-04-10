import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessionToolDto } from './dto/create-profession-tool.dto';
import { UpdateProfessionToolDto } from './dto/update-profession-tool.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProfessionToolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfessionToolDto: CreateProfessionToolDto) {
    try {
      const professionTool = await this.prisma.professionTool.create({
        data: createProfessionToolDto,
      });
      return professionTool;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const professionTools = await this.prisma.professionTool.findMany({
        include: {
          profession: true,
          tool: true,
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });
      return professionTools;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const professionTool = await this.prisma.professionTool.findUnique({
        where: { id },
        include: {
          profession: true,
          tool: true,
        },
      });
      if (!professionTool) throw new NotFoundException('Not found');
      return professionTool;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateProfessionToolDto: UpdateProfessionToolDto) {
    try {
      const updated = await this.prisma.professionTool.update({
        data: updateProfessionToolDto,
        where: { id },
      });
      return updated;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.professionTool.delete({
        where: { id },
      });
      return deleted;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
