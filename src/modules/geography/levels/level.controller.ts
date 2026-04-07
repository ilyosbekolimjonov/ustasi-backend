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
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ROLE } from '../../../common/constants/legacy-prisma.enums';
import { Roles } from '../../../decorators/roles.decorators';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('Level')
@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new level' })
  @ApiBody({ type: CreateLevelDto })
  @ApiResponse({ status: 201, description: 'Level created successfully', type: CreateLevelDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all levels with pagination and search' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search keyword', type: String })
  @ApiResponse({ status: 200, description: 'List of levels', type: [CreateLevelDto] })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    return this.levelService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a level by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Level ID' })
  @ApiResponse({ status: 200, description: 'Level found', type: CreateLevelDto })
  @ApiResponse({ status: 404, description: 'Level not found' })
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a level by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Level ID' })
  @ApiBody({ type: UpdateLevelDto })
  @ApiResponse({ status: 200, description: 'Level updated successfully', type: CreateLevelDto })
  @ApiResponse({ status: 404, description: 'Level not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a level by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Level ID' })
  @ApiResponse({ status: 200, description: 'Level deleted successfully' })
  @ApiResponse({ status: 404, description: 'Level not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.levelService.remove(id);
  }
}

