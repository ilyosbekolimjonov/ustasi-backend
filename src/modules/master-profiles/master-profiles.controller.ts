import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/constants/domain.enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ListMastersQueryDto } from './dto/list-masters-query.dto';
import { UpdateMasterProfileDto } from './dto/update-master-profile.dto';
import { MasterProfilesService } from './master-profiles.service';

@ApiTags('Masters')
@Controller('masters')
export class MasterProfilesController {
  constructor(private readonly masterProfilesService: MasterProfilesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List public master profiles' })
  listPublic(@Query() query: ListMastersQueryDto) {
    return this.masterProfilesService.listPublic(query);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MASTER)
  @Get('me')
  @ApiOperation({ summary: 'Get the current master profile' })
  getOwn(@CurrentUser('sub') userId: string) {
    return this.masterProfilesService.getOwnProfile(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MASTER)
  @Patch('me')
  @ApiOperation({
    summary: 'Create or update the authenticated master profile',
  })
  updateOwn(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateMasterProfileDto,
  ) {
    return this.masterProfilesService.updateOwnProfile(userId, dto);
  }

  @Public()
  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get a public master profile by id or slug' })
  findPublicOne(@Param('idOrSlug') idOrSlug: string) {
    return this.masterProfilesService.findPublicByIdOrSlug(idOrSlug);
  }
}
