import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/constants/domain.enums';
import { USER_ROLES } from '../../common/constants/user-roles';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ListServiceRequestsQueryDto } from './dto/list-service-requests-query.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { ServiceRequestsService } from './service-requests.service';

@ApiTags('Service Requests')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @Post()
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'Create a service request as a user' })
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateServiceRequestDto,
  ) {
    return this.serviceRequestsService.create(userId, dto);
  }

  @Get('my')
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'List the current user service requests' })
  findMine(
    @CurrentUser('sub') userId: string,
    @Query() query: ListServiceRequestsQueryDto,
  ) {
    return this.serviceRequestsService.findMine(userId, query);
  }

  @Get('open')
  @Roles(UserRole.MASTER)
  @ApiOperation({ summary: 'List open service requests for masters' })
  findOpen(@Query() query: ListServiceRequestsQueryDto) {
    return this.serviceRequestsService.findOpen(query);
  }

  @Get('claimed/my')
  @Roles(UserRole.MASTER)
  @ApiOperation({ summary: 'List requests claimed by the current master' })
  findClaimed(
    @CurrentUser('sub') userId: string,
    @Query() query: ListServiceRequestsQueryDto,
  ) {
    return this.serviceRequestsService.findClaimedByMaster(userId, query);
  }

  @Post(':id/claim')
  @Roles(UserRole.MASTER)
  @ApiOperation({ summary: 'Atomically claim an open service request' })
  claim(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.serviceRequestsService.claim(userId, id);
  }

  @Patch(':id/status')
  @Roles(UserRole.MASTER)
  @ApiOperation({ summary: 'Update the status of a claimed request' })
  updateClaimedStatus(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestStatusDto,
  ) {
    return this.serviceRequestsService.updateClaimedStatus(userId, id, dto);
  }

  @Patch(':id')
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'Update your own open service request' })
  updateOwn(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
  ) {
    return this.serviceRequestsService.updateOwn(userId, id, dto);
  }

  @Patch(':id/cancel')
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'Cancel your own open service request' })
  cancelOwn(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.serviceRequestsService.cancelOwn(userId, id);
  }

  @Post(':id/cancel')
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'Backward-compatible alias to cancel your own service request' })
  cancelOwnAlias(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.serviceRequestsService.cancelOwn(userId, id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a service request detail for the current actor',
  })
  findOne(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Param('id') id: string,
  ) {
    return this.serviceRequestsService.findOneForActor(userId, role, id);
  }
}
