import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/constants/domain.enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { UsersService } from './users.service';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { SelfUpdateUserDto } from './dto/self-update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  me(@CurrentUser('sub') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update the authenticated user without privileged fields',
  })
  updateMe(@CurrentUser('sub') userId: string, @Body() dto: SelfUpdateUserDto) {
    return this.usersService.updateSelf(userId, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'List users for admins' })
  findAll(@Query() query: PaginationQueryDto & { search?: string }) {
    return this.usersService.findAll(query);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VIEWER_ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id for admins' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/admin')
  @ApiOperation({ summary: 'Admin-only user update endpoint' })
  updateAsAdmin(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.usersService.updateAsAdmin(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Admin-only user deletion endpoint' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
