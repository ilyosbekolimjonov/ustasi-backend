import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ListMastersQueryDto } from './dto/list-masters-query.dto';
import { UpdateMasterProfileDto } from './dto/update-master-profile.dto';

const masterProfileInclude = {
  user: {
    select: {
      id: true,
      fullname: true,
      phone: true,
      avatarUrl: true,
      createdAt: true,
    },
  },
} satisfies Prisma.MasterProfileInclude;

type MasterProfileRecord = Prisma.MasterProfileGetPayload<{
  include: typeof masterProfileInclude;
}>;

@Injectable()
export class MasterProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: ListMastersQueryDto) {
    const where: Prisma.MasterProfileWhereInput = {
      ...(query.availableOnly === 'false' ? {} : { isAvailable: true }),
      ...(query.category
        ? {
            category: {
              contains: query.category,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.city
        ? {
            city: {
              contains: query.city,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              { category: { contains: query.search, mode: 'insensitive' } },
              { city: { contains: query.search, mode: 'insensitive' } },
              { bio: { contains: query.search, mode: 'insensitive' } },
              {
                user: {
                  fullname: { contains: query.search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.masterProfile.findMany({
        where,
        include: masterProfileInclude,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ isAvailable: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.masterProfile.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toPublicMaster(item)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async findPublicByIdOrSlug(idOrSlug: string) {
    const profile = await this.prisma.masterProfile.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: masterProfileInclude,
    });

    if (!profile) {
      throw new NotFoundException('Master profile not found');
    }

    return this.toPublicMaster(profile);
  }

  async updateOwnProfile(userId: string, dto: UpdateMasterProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.prisma.masterProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      if (
        !dto.category ||
        !dto.city ||
        !dto.bio ||
        !dto.experienceText ||
        !dto.profileImageUrl
      ) {
        throw new BadRequestException(
          'category, city, bio, experienceText and profileImageUrl are required for first profile setup',
        );
      }
    }

    const profile = await this.prisma.masterProfile.upsert({
      where: { userId },
      create: {
        userId,
        slug: this.buildMasterSlug(user.fullname, user.id),
        category: dto.category!,
        city: dto.city!,
        region: dto.region ?? null,
        bio: dto.bio!,
        experienceText: dto.experienceText!,
        experienceYears: dto.experienceYears ?? null,
        profileImageUrl: dto.profileImageUrl!,
        isAvailable: dto.isAvailable ?? true,
      },
      update: {
        category: dto.category,
        city: dto.city,
        region: dto.region,
        bio: dto.bio,
        experienceText: dto.experienceText,
        experienceYears: dto.experienceYears,
        profileImageUrl: dto.profileImageUrl,
        isAvailable: dto.isAvailable,
      },
      include: masterProfileInclude,
    });

    return this.toPublicMaster(profile);
  }

  async getOwnProfile(userId: string) {
    const profile = await this.prisma.masterProfile.findUnique({
      where: { userId },
      include: masterProfileInclude,
    });

    if (!profile) {
      throw new NotFoundException('Master profile not found');
    }

    return this.toPublicMaster(profile);
  }

  private toPublicMaster(profile: MasterProfileRecord) {
    return {
      id: profile.id,
      userId: profile.userId,
      slug: profile.slug,
      fullName: profile.user.fullname,
      phone: profile.user.phone,
      avatarUrl: profile.user.avatarUrl,
      category: profile.category,
      city: profile.city,
      region: profile.region,
      bio: profile.bio,
      experienceText: profile.experienceText,
      experienceYears: profile.experienceYears,
      profileImageUrl: profile.profileImageUrl,
      isAvailable: profile.isAvailable,
      ratingAverage: Number(profile.ratingAverage),
      jobsCompletedCount: profile.jobsCompletedCount,
      memberSince: profile.user.createdAt,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  private buildMasterSlug(fullName: string, userId: string) {
    const base =
      fullName
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 48) || 'master';

    return `${base}-${userId.slice(0, 8)}`;
  }
}
