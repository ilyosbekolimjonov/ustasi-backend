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
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../../../decorators/roles.decorators';
import { ROLE } from '../../../common/constants/legacy-prisma.enums';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('Viloyat')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Uzbekistan region / viloyat' })
  @ApiBody({ type: CreateRegionDto })
  @ApiResponse({
    status: 201,
    description: 'Viloyat created successfully',
    type: CreateRegionDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Uzbekistan regions / viloyatlar with pagination and search' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search keyword',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of viloyatlar',
    type: [CreateRegionDto],
  })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    return this.regionService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a viloyat by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Viloyat ID' })
  @ApiResponse({
    status: 200,
    description: 'Viloyat found',
    type: CreateRegionDto,
  })
  @ApiResponse({ status: 404, description: 'Viloyat not found' })
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a viloyat by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Viloyat ID' })
  @ApiBody({ type: UpdateRegionDto })
  @ApiResponse({
    status: 200,
    description: 'Viloyat updated successfully',
    type: CreateRegionDto,
  })
  @ApiResponse({ status: 404, description: 'Viloyat not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a viloyat by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Viloyat ID' })
  @ApiResponse({ status: 200, description: 'Viloyat deleted successfully' })
  @ApiResponse({ status: 404, description: 'Viloyat not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
