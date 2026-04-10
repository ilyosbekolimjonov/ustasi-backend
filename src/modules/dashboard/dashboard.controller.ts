import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/constants/domain.enums';
import { USER_ROLES } from '../../common/constants/user-roles';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('user')
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'Get USER dashboard summary' })
  getUserSummary(@CurrentUser('sub') userId: string) {
    return this.dashboardService.getUserSummary(userId);
  }

  @Get('master')
  @Roles(UserRole.MASTER)
  @ApiOperation({ summary: 'Get MASTER dashboard summary' })
  getMasterSummary(@CurrentUser('sub') userId: string) {
    return this.dashboardService.getMasterSummary(userId);
  }
}
