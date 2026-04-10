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
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
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

@ApiTags('Size')
@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiBody({ type: CreateSizeDto })
  @ApiResponse({
    status: 201,
    description: 'Size created successfully',
    type: CreateSizeDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sizes with pagination and search' })
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
    description: 'List of sizes',
    type: [CreateSizeDto],
  })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    return this.sizeService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a size by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Size ID' })
  @ApiResponse({ status: 200, description: 'Size found', type: CreateSizeDto })
  @ApiResponse({ status: 404, description: 'Size not found' })
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a size by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Size ID' })
  @ApiBody({ type: UpdateSizeDto })
  @ApiResponse({
    status: 200,
    description: 'Size updated successfully',
    type: CreateSizeDto,
  })
  @ApiResponse({ status: 404, description: 'Size not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(id, updateSizeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a size by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Size ID' })
  @ApiResponse({ status: 200, description: 'Size deleted successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.sizeService.remove(id);
  }
}
