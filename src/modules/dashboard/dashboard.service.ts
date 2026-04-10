import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRequestStatus } from '../../common/constants/domain.enums';
import { PrismaService } from '../../prisma/prisma.service';
import { toPublicUser } from '../users/user.mapper';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [
      latestRequests,
      suggestedMasters,
      totalRequests,
      openRequests,
      completedRequests,
    ] =
      await Promise.all([
        this.prisma.serviceRequest.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        this.prisma.masterProfile.findMany({
          where: { isAvailable: true },
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
          take: 4,
          orderBy: [{ ratingAverage: 'desc' }, { jobsCompletedCount: 'desc' }],
        }),
        this.prisma.serviceRequest.count({
          where: { userId },
        }),
        this.prisma.serviceRequest.count({
          where: {
            userId,
            status: ServiceRequestStatus.OPEN,
          },
        }),
        this.prisma.serviceRequest.count({
          where: {
            userId,
            status: ServiceRequestStatus.DONE,
          },
        }),
      ]);

    return {
      profile: toPublicUser(user),
      requestCounts: {
        total: totalRequests,
        open: openRequests,
        completed: completedRequests,
      },
      latestRequests: latestRequests.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        city: item.city,
        status: item.status,
        images: item.images,
        budgetMin: item.budgetMin !== null ? Number(item.budgetMin) : null,
        budgetMax: item.budgetMax !== null ? Number(item.budgetMax) : null,
        createdAt: item.createdAt,
      })),
      suggestedMasters: suggestedMasters.map((profile) => ({
        id: profile.id,
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
        ratingAverage: Number(profile.ratingAverage),
        jobsCompletedCount: profile.jobsCompletedCount,
        profileImageUrl: profile.profileImageUrl,
        isAvailable: profile.isAvailable,
      })),
    };
  }

  async getMasterSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        masterProfile: true,
      },
    });

    if (!user || !user.masterProfile) {
      throw new NotFoundException('Master profile not found');
    }

    const [
      openRequestCount,
      claimedRequestCount,
      latestClaimedRequests,
      latestOpenRequests,
    ] = await Promise.all([
      this.prisma.serviceRequest.count({
        where: { status: 'OPEN' },
      }),
      this.prisma.serviceRequest.count({
        where: { claimedByMasterId: userId },
      }),
      this.prisma.serviceRequest.findMany({
        where: { claimedByMasterId: userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      this.prisma.serviceRequest.findMany({
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      profile: toPublicUser(user),
      openRequestCount,
      claimedRequestCount,
      latestClaimedRequests: latestClaimedRequests.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        city: item.city,
        status: item.status,
        claimedAt: item.claimedAt,
        updatedAt: item.updatedAt,
      })),
      latestOpenRequests: latestOpenRequests.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        city: item.city,
        status: item.status,
        createdAt: item.createdAt,
      })),
    };
  }
}
