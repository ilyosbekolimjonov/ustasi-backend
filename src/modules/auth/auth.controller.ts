import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import type { Request } from 'express';
import type { JwtPayload } from '../../common/types/jwt-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user and send email verification link' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login by email or phone' })
  login(@Body() loginDto: LoginDto, @Req() request: Request) {
    return this.authService.login(loginDto, {
      ip: request.ip ?? null,
      userAgent: request.headers['user-agent'] ?? null,
    });
  }

  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify account email by signed verification token' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Rotate refresh token and issue a new access token pair' })
  refresh(
    @CurrentUser() user: JwtPayload,
    @Body() body: RefreshTokenDto,
    @Req() request: Request,
  ) {
    return this.authService.refresh(user, body.refreshToken, {
      ip: request.ip ?? null,
      userAgent: request.headers['user-agent'] ?? null,
    });
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Invalidate the current refresh token session' })
  logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOkResponse({ description: 'Current authenticated user' })
  me(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('sessions')
  @ApiOperation({ summary: 'List the current user sessions' })
  sessions(
    @CurrentUser('sub') userId: string,
    @CurrentUser('sid') sessionId: string,
  ) {
    return this.authService.getSessions(userId, sessionId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Delete one of the current user sessions' })
  deleteSession(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.authService.deleteSession(userId, id);
  }
}

