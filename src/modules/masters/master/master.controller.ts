import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../../../decorators/roles.decorators';
import { ROLE } from '../../../common/constants/legacy-prisma.enums';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('Master')
@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  @ApiOperation({ summary: 'Create master' })
  @ApiBody({ type: CreateMasterDto })
  @ApiResponse({ status: 201, description: 'Master successfully created' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createMasterDto: CreateMasterDto) {
    return this.masterService.create(createMasterDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all masters (with pagination, search, filters, and star sorting)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'ali',
    description: 'Search by firstname, lastname or phoneNumber',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    example: 2020,
    description: 'Filter masters with year >= from',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    example: 2024,
    description: 'Filter masters with year <= to',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    example: 'true',
    description: 'Filter by activity status (true/false)',
  })
  @ApiQuery({
    name: 'starOrder',
    required: false,
    example: 'desc',
    description:
      'Order by average star rating: "asc" for low to high, "desc" for high to low (default: desc)',
  })
  @ApiResponse({ status: 200, description: 'List of masters returned' })
  findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      search?: string;
      from?: number;
      to?: number;
      isActive?: string;
      starOrder?: string;
    },
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    const isActive = query.isActive || '';
    const orderByStar = query.starOrder || 'desc';
    return this.masterService.findAll(
      page,
      limit,
      search,
      query.from,
      query.to,
      isActive,
      orderByStar,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get master by ID' })
  @ApiParam({ name: 'id', description: 'Master ID' })
  @ApiResponse({ status: 200, description: 'Master found' })
  @ApiResponse({ status: 404, description: 'Master not found' })
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master by ID' })
  @ApiParam({ name: 'id', description: 'Master ID' })
  @ApiBody({ type: UpdateMasterDto })
  @ApiResponse({ status: 200, description: 'Master updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update payload' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateMasterDto: UpdateMasterDto) {
    return this.masterService.update(id, updateMasterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master by ID' })
  @ApiParam({ name: 'id', description: 'Master ID' })
  @ApiResponse({ status: 200, description: 'Master deleted successfully' })
  @ApiResponse({ status: 404, description: 'Master not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.masterService.remove(id);
  }
}
