import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, UserStatus as PrismaUserStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UserRole } from '../../common/constants/domain.enums';
import type { JwtPayload } from '../../common/types/jwt-payload.interface';
import {
  comparePassword,
  generateOpaqueToken,
  hashPassword,
  sha256,
} from '../../common/utils/hash.util';
import type { AuthConfig } from '../../config/auth.config';
import { EmailService } from '../../integrations/email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { toPublicUser } from '../users/user.mapper';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type RequestMeta = {
  ip: string | null;
  userAgent: string | null;
};

@Injectable()
export class AuthService {
  private readonly authConfig: AuthConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.authConfig = this.configService.getOrThrow<AuthConfig>('auth');
  }

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase();
    const phone = registerDto.phone.trim();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser?.email === email) {
      throw new BadRequestException('Email already in use');
    }

    if (existingUser?.phone === phone) {
      throw new BadRequestException('Phone already in use');
    }

    const verificationToken = generateOpaqueToken();
    const verificationTokenHash = sha256(verificationToken);
    const passwordHash = await hashPassword(registerDto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          fullname: registerDto.fullName.trim(),
          email,
          phone,
          passwordHash,
          avatarUrl: registerDto.avatarUrl?.trim() || null,
          role: registerDto.role as Role,
          status: PrismaUserStatus.ACTIVE,
          isVerified: false,
          emailVerificationTokenHash: verificationTokenHash,
          emailVerificationTokenExpiresAt: this.resolveVerificationExpiry(),
          masterProfile:
            registerDto.role === UserRole.MASTER
              ? {
                  create: {
                    slug: this.buildMasterSlug(registerDto.fullName),
                    category: registerDto.category!.trim(),
                    city: registerDto.city!.trim(),
                    region: registerDto.region?.trim() || null,
                    bio: registerDto.bio!.trim(),
                    experienceText: registerDto.experienceText!.trim(),
                    experienceYears: registerDto.experienceYears ?? null,
                    profileImageUrl: registerDto.profileImageUrl!.trim(),
                  },
                }
              : undefined,
        },
        include: {
          masterProfile: true,
        },
      });
    });

    const verificationEmailSent = await this.trySendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message:
        'Hisob yaratildi. Tasdiqlash havolasi emailingizga yuborildi, lekin tizimga kirish hozirdan mumkin.',
      verificationEmailSent,
      user: toPublicUser(user),
    };
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: sha256(token),
      },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Verification token is invalid');
    }

    if (
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException('Verification token has expired');
    }

    const verifiedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
      include: {
        masterProfile: true,
      },
    });

    return {
      message: 'Email verified successfully',
      user: toPublicUser(verifiedUser),
    };
  }

  async resendVerificationEmail(emailInput: string) {
    const email = emailInput.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      return {
        message:
          'Agar bunday email mavjud bo‘lsa, tasdiqlash havolasi qayta yuborildi.',
      };
    }

    if (user.isVerified) {
      return {
        message: 'Email allaqachon tasdiqlangan.',
        user: toPublicUser(user),
      };
    }

    const verificationToken = generateOpaqueToken();

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationTokenHash: sha256(verificationToken),
        emailVerificationTokenExpiresAt: this.resolveVerificationExpiry(),
      },
      include: {
        masterProfile: true,
      },
    });

    const verificationEmailSent = await this.trySendVerificationEmail(
      updatedUser.email,
      verificationToken,
    );

    return {
      message: 'Tasdiqlash havolasi qayta yuborildi.',
      verificationEmailSent,
      user: toPublicUser(updatedUser),
    };
  }

  async login(loginDto: LoginDto, meta: RequestMeta) {
    const identifier = loginDto.identifier.trim();
    const normalizedEmail = identifier.toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: identifier }],
      },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await comparePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== PrismaUserStatus.ACTIVE) {
      throw new ForbiddenException('Account is inactive');
    }

    const sessionId = randomUUID();
    const tokens = await this.issueTokens(user.id, user.role, sessionId);

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        ip: meta.ip,
        userAgent: meta.userAgent,
        refreshTokenHash: sha256(tokens.refreshToken),
        expiresAt: this.resolveExpiryDate(this.authConfig.refreshExpiresIn),
      },
    });

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  }

  async refresh(payload: JwtPayload, refreshToken: string, meta: RequestMeta) {
    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
    });

    if (!session || session.userId !== payload.sub || session.revokedAt) {
      throw new UnauthorizedException('Session is invalid');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session has expired');
    }

    if (session.refreshTokenHash !== sha256(refreshToken)) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    const tokens = await this.issueTokens(
      payload.sub,
      payload.role,
      payload.sid,
    );

    await this.prisma.session.update({
      where: { id: payload.sid },
      data: {
        refreshTokenHash: sha256(tokens.refreshToken),
        expiresAt: this.resolveExpiryDate(this.authConfig.refreshExpiresIn),
        revokedAt: null,
        ip: meta.ip ?? undefined,
        userAgent: meta.userAgent ?? undefined,
      },
    });

    return tokens;
  }

  async logout(payload: JwtPayload) {
    const session = await this.prisma.session.findFirst({
      where: { id: payload.sid, userId: payload.sub, revokedAt: null },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.session.update({
      where: { id: payload.sid },
      data: {
        revokedAt: new Date(),
        refreshTokenHash: '',
      },
    });

    return {
      message: 'Logged out successfully',
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toPublicUser(user);
  }

  async getSessions(userId: string, currentSessionId: string) {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map((session) => ({
      id: session.id,
      ip: session.ip,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      isCurrent: session.id === currentSessionId,
    }));
  }

  async deleteSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    return {
      message: 'Session deleted successfully',
    };
  }

  private async issueTokens(userId: string, role: string, sessionId: string) {
    const accessPayload: JwtPayload = {
      sub: userId,
      role: role as JwtPayload['role'],
      sid: sessionId,
      type: 'access',
    };
    const refreshPayload: JwtPayload = {
      sub: userId,
      role: role as JwtPayload['role'],
      sid: sessionId,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.authConfig.accessSecret,
        expiresIn: this.authConfig.accessExpiresIn as never,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.authConfig.refreshSecret,
        expiresIn: this.authConfig.refreshExpiresIn as never,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private resolveExpiryDate(expiresIn: string): Date {
    const durationMatch = /^(\d+)([smhd])$/.exec(expiresIn.trim());
    if (!durationMatch) {
      throw new BadRequestException('Unsupported expiresIn format');
    }

    const value = Number(durationMatch[1]);
    const unit = durationMatch[2];
    const unitToMilliseconds: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * unitToMilliseconds[unit]);
  }

  private resolveVerificationExpiry() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  private buildMasterSlug(fullName: string) {
    const base =
      fullName
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 48) || 'master';

    return `${base}-${randomUUID().slice(0, 8)}`;
  }

  private async trySendVerificationEmail(email: string, token: string) {
    try {
      await this.emailService.sendVerificationEmail(email, token);
      return true;
    } catch {
      return false;
    }
  }
}
