import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ServiceRequestStatus,
  UserRole,
} from '../../common/constants/domain.enums';
import { isUserRole } from '../../common/constants/user-roles';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ListServiceRequestsQueryDto } from './dto/list-service-requests-query.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';

const serviceRequestInclude = {
  user: {
    select: {
      id: true,
      fullname: true,
      phone: true,
      avatarUrl: true,
    },
  },
  claimedByMaster: {
    select: {
      id: true,
      fullname: true,
      phone: true,
      masterProfile: {
        select: {
          id: true,
          slug: true,
          category: true,
          city: true,
          profileImageUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ServiceRequestInclude;

type ServiceRequestRecord = Prisma.ServiceRequestGetPayload<{
  include: typeof serviceRequestInclude;
}>;

@Injectable()
export class ServiceRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateServiceRequestDto) {
    if (
      dto.budgetMin !== undefined &&
      dto.budgetMax !== undefined &&
      dto.budgetMax < dto.budgetMin
    ) {
      throw new BadRequestException(
        'budgetMax must be greater than or equal to budgetMin',
      );
    }

    const request = await this.prisma.serviceRequest.create({
      data: {
        userId,
        title: dto.title.trim(),
        description: dto.description.trim(),
        category: dto.category.trim(),
        city: dto.city.trim(),
        addressText: dto.addressText?.trim() || null,
        budgetMin: dto.budgetMin ?? null,
        budgetMax: dto.budgetMax ?? null,
        images: this.normalizeImages(dto.images),
      },
      include: serviceRequestInclude,
    });

    return this.toResponse(request);
  }

  async findMine(userId: string, query: ListServiceRequestsQueryDto) {
    return this.findMany(
      {
        userId,
        ...(query.status ? { status: query.status } : {}),
      },
      query,
    );
  }

  async findOpen(query: ListServiceRequestsQueryDto) {
    return this.findMany(
      {
        status: ServiceRequestStatus.OPEN,
      },
      query,
    );
  }

  async findClaimedByMaster(
    userId: string,
    query: ListServiceRequestsQueryDto,
  ) {
    return this.findMany(
      {
        claimedByMasterId: userId,
      },
      query,
    );
  }

  async findOneForActor(userId: string, role: string, requestId: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: serviceRequestInclude,
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    if (isUserRole(role) && request.userId !== userId) {
      throw new ForbiddenException('You cannot view this request');
    }

    if (
      role === UserRole.MASTER &&
      request.status === ServiceRequestStatus.CANCELLED &&
      request.claimedByMasterId !== userId
    ) {
      throw new ForbiddenException('This request is no longer visible');
    }

    return this.toResponse(request);
  }

  async updateOwn(
    userId: string,
    requestId: string,
    dto: UpdateServiceRequestDto,
  ) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.userId !== userId) {
      throw new NotFoundException('Service request not found');
    }

    if (request.status !== ServiceRequestStatus.OPEN) {
      throw new BadRequestException('Only open requests can be updated');
    }

    if (
      dto.budgetMin !== undefined &&
      dto.budgetMax !== undefined &&
      dto.budgetMax < dto.budgetMin
    ) {
      throw new BadRequestException(
        'budgetMax must be greater than or equal to budgetMin',
      );
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        title: dto.title?.trim(),
        description: dto.description?.trim(),
        category: dto.category?.trim(),
        city: dto.city?.trim(),
        ...(dto.addressText !== undefined
          ? { addressText: dto.addressText.trim() || null }
          : {}),
        ...(dto.budgetMin !== undefined ? { budgetMin: dto.budgetMin } : {}),
        ...(dto.budgetMax !== undefined ? { budgetMax: dto.budgetMax } : {}),
        ...(dto.images !== undefined
          ? { images: this.normalizeImages(dto.images) }
          : {}),
      },
      include: serviceRequestInclude,
    });

    return this.toResponse(updated);
  }

  async cancelOwn(userId: string, requestId: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.userId !== userId) {
      throw new NotFoundException('Service request not found');
    }

    if (request.status !== ServiceRequestStatus.OPEN) {
      throw new BadRequestException('Only open requests can be cancelled');
    }

    const cancelled = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: ServiceRequestStatus.CANCELLED,
      },
      include: serviceRequestInclude,
    });

    return this.toResponse(cancelled);
  }

  async claim(userId: string, requestId: string) {
    const masterProfile = await this.prisma.masterProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!masterProfile) {
      throw new BadRequestException(
        'Complete your master profile before claiming requests',
      );
    }

    const claimed = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.serviceRequest.findUnique({
        where: { id: requestId },
      });

      if (!existing) {
        throw new NotFoundException('Service request not found');
      }

      if (existing.userId === userId) {
        throw new BadRequestException('You cannot claim your own request');
      }

      const claimResult = await tx.serviceRequest.updateMany({
        where: {
          id: requestId,
          status: ServiceRequestStatus.OPEN,
          claimedByMasterId: null,
        },
        data: {
          status: ServiceRequestStatus.CLAIMED,
          claimedByMasterId: userId,
          claimedAt: new Date(),
        },
      });

      if (claimResult.count === 0) {
        throw new BadRequestException('This request has already been claimed');
      }

      await tx.conversation.upsert({
        where: {
          requestId,
        },
        create: {
          requestId,
          userId: existing.userId,
          masterId: userId,
        },
        update: {},
      });

      return tx.serviceRequest.findUniqueOrThrow({
        where: { id: requestId },
        include: serviceRequestInclude,
      });
    });

    return this.toResponse(claimed);
  }

  async updateClaimedStatus(
    userId: string,
    requestId: string,
    dto: UpdateServiceRequestStatusDto,
  ) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.claimedByMasterId !== userId) {
      throw new NotFoundException('Claimed request not found');
    }

    if (
      ![
        ServiceRequestStatus.CLAIMED,
        ServiceRequestStatus.IN_PROGRESS,
      ].includes(request.status as typeof ServiceRequestStatus.CLAIMED)
    ) {
      throw new BadRequestException('This request can no longer change status');
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: dto.status,
      },
      include: serviceRequestInclude,
    });

    return this.toResponse(updated);
  }

  private async findMany(
    baseWhere: Prisma.ServiceRequestWhereInput,
    query: ListServiceRequestsQueryDto,
  ) {
    const where: Prisma.ServiceRequestWhereInput = {
      ...baseWhere,
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
              { title: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
              { category: { contains: query.search, mode: 'insensitive' } },
              { city: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
        include: serviceRequestInclude,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toResponse(item)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  private toResponse(request: ServiceRequestRecord) {
    return {
      id: request.id,
      title: request.title,
      description: request.description,
      category: request.category,
      city: request.city,
      addressText: request.addressText,
      budgetMin: request.budgetMin !== null ? Number(request.budgetMin) : null,
      budgetMax: request.budgetMax !== null ? Number(request.budgetMax) : null,
      images: request.images,
      status: request.status,
      isEditable: request.status === ServiceRequestStatus.OPEN,
      claimedAt: request.claimedAt,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      user: {
        id: request.user.id,
        fullName: request.user.fullname,
        phone: request.user.phone,
        avatarUrl: request.user.avatarUrl,
      },
      claimedByMaster: request.claimedByMaster
        ? {
            id: request.claimedByMaster.id,
            fullName: request.claimedByMaster.fullname,
            phone: request.claimedByMaster.phone,
            masterProfile: request.claimedByMaster.masterProfile,
          }
        : null,
    };
  }

  private normalizeImages(images?: string[]) {
    if (!images) {
      return [];
    }

    const normalized = images
      .map((image) => image.trim())
      .filter((image) => image.length > 0);

    if (normalized.length > 2) {
      throw new BadRequestException('A maximum of 2 images is allowed');
    }

    return normalized;
  }
}
