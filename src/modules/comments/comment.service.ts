import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, req: Request) {
    try {
      const user = req['user'];
      const { masterId, star } = createCommentDto;
      const master = await this.prisma.master.findUnique({
        where: { id: masterId },
        include: { comments: true },
      });

      const avgStar =
        ((master?.comments.reduce(
          (sum, comment) => sum + Number(comment.star),
          0,
        ) ?? 0) +
          star) /
        ((master?.comments.length ?? 0) + 1);

      await this.prisma.master.update({
        data: { averageStar: avgStar.toFixed(1) },
        where: { id: masterId },
      });
      const comment = await this.prisma.comment.create({
        data: { ...createCommentDto, userId: user.id },
      });
      return comment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const comments = await this.prisma.comment.findMany({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          master: true,
          user: true,
        },
      });
      return comments;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) throw new NotFoundException('Not found');
      return comment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const updated = await this.prisma.comment.update({
        data: updateCommentDto,
        where: { id },
      });
      return { data: updated };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const removed = await this.prisma.comment.delete({ where: { id } });
      return removed;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
