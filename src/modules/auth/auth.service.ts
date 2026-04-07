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
import { UserRole, UserStatus } from '../../common/constants/domain.enums';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import {
  comparePassword,
  generateOpaqueToken,
  hashPassword,
  sha256,
} from '../../common/utils/hash.util';
import { AuthConfig } from '../../config/auth.config';
import { EmailService } from '../../integrations/email/email.service';
import { toPublicUser } from '../users/user.mapper';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../../prisma/prisma.service';

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
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingByEmail) {
      throw new BadRequestException('Email already in use');
    }

    const existingByPhone = await this.prisma.user.findUnique({
      where: { phone: registerDto.phone },
    });
    if (existingByPhone) {
      throw new BadRequestException('Phone already in use');
    }

    const verificationToken = generateOpaqueToken();
    const verificationTokenHash = sha256(verificationToken);
    const passwordHash = await hashPassword(registerDto.password);

    const user = await this.prisma.user.create({
      data: {
        fullname: registerDto.fullname,
        email: registerDto.email,
        phone: registerDto.phone,
        passwordHash,
        regionId: registerDto.regionId,
        role: UserRole.USER_FIZ as Role,
        status: UserStatus.INACTIVE as PrismaUserStatus,
        isVerified: false,
        iin: registerDto.iin ?? null,
        mfo: registerDto.mfo ?? null,
        rs: registerDto.rs ?? null,
        bank: registerDto.bank ?? null,
        oked: registerDto.oked ?? null,
        address: registerDto.address ?? null,
        emailVerificationTokenHash: verificationTokenHash,
        emailVerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      message: 'Registration successful. Please verify your email.',
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
    });

    if (!user) {
      throw new NotFoundException('Verification token is invalid');
    }

    if (!user.emailVerificationTokenExpiresAt || user.emailVerificationTokenExpiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    const verifiedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        status: PrismaUserStatus.ACTIVE,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
    });

    return {
      message: 'Email verified successfully',
      user: toPublicUser(verifiedUser),
    };
  }

  async login(loginDto: LoginDto, meta: RequestMeta) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: loginDto.identifier }, { phone: loginDto.identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await comparePassword(loginDto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your email before logging in');
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

    const tokens = await this.issueTokens(payload.sub, payload.role, payload.sid);

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

    // const [accessToken, refreshToken] = await Promise.all([
    //   this.jwtService.signAsync(accessPayload, {
    //     secret: this.authConfig.accessSecret,
    //     expiresIn: this.authConfig.accessExpiresIn,
    //   }),
    //   this.jwtService.signAsync(refreshPayload, {
    //     secret: this.authConfig.refreshSecret,
    //     expiresIn: this.authConfig.refreshExpiresIn,
    //   }),
    // ]);

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: Number(this.configService.get('JWT_ACCESS_EXPIRES')),
    })

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: Number(this.configService.get('JWT_REFRESH_EXPIRES')),
    });

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
}

