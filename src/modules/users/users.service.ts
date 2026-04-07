import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { SelfUpdateUserDto } from './dto/self-update-user.dto';
import { toPublicUser } from './user.mapper';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto & { search?: string }) {
    const where = query.search
      ? {
          OR: [
            { fullname: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
            { phone: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: items.map(toPublicUser),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toPublicUser(user);
  }

  async updateSelf(userId: string, dto: SelfUpdateUserDto) {
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existingPhone && existingPhone.id !== userId) {
        throw new BadRequestException('Phone already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullname: dto.fullname,
        phone: dto.phone,
        regionId: dto.regionId,
        iin: dto.iin,
        mfo: dto.mfo,
        rs: dto.rs,
        bank: dto.bank,
        oked: dto.oked,
        address: dto.address,
      },
    });
    return toPublicUser(updatedUser);
  }

  async updateAsAdmin(userId: string, dto: AdminUpdateUserDto) {
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existingPhone && existingPhone.id !== userId) {
        throw new BadRequestException('Phone already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullname: dto.fullname,
        email: dto.email,
        phone: dto.phone,
        regionId: dto.regionId,
        role: dto.role as Role | undefined,
        status: dto.status as UserStatus | undefined,
        isVerified: dto.isVerified,
        iin: dto.iin,
        mfo: dto.mfo,
        rs: dto.rs,
        bank: dto.bank,
        oked: dto.oked,
        address: dto.address,
      },
    });
    return toPublicUser(updatedUser);
  }

  async remove(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}

