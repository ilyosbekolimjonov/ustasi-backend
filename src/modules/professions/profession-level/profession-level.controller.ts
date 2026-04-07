import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, 
  UseGuards
} from '@nestjs/common';
import { ProfessionLevelService } from './profession-level.service';
import { CreateProfessionLevelDto } from './dto/create-profession-level.dto';
import { UpdateProfessionLevelDto } from './dto/update-profession-level.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ROLE } from '../../../common/constants/legacy-prisma.enums';
import { Roles } from '../../../decorators/roles.decorators';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';


@ApiTags('ProfessionLevel')
@Controller('profession-level')
export class ProfessionLevelController {
  constructor(private readonly professionLevelService: ProfessionLevelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new profession level' })
  @ApiResponse({ status: 201, description: 'Profession level created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createProfessionLevelDto: CreateProfessionLevelDto) {
    return this.professionLevelService.create(createProfessionLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all profession levels with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of profession levels' })
  findAll(@Query() query: { page?: number, limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return this.professionLevelService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific profession level by ID' })
  @ApiParam({ name: 'id', description: 'Profession level ID' })
  @ApiResponse({ status: 200, description: 'Profession level found' })
  @ApiResponse({ status: 404, description: 'Profession level not found' })
  findOne(@Param('id') id: string) {
    return this.professionLevelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a profession level by ID' })
  @ApiParam({ name: 'id', description: 'Profession level ID' })
  @ApiResponse({ status: 200, description: 'Profession level updated successfully' })
  @ApiResponse({ status: 404, description: 'Profession level not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProfessionLevelDto: UpdateProfessionLevelDto) {
    return this.professionLevelService.update(id, updateProfessionLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a profession level by ID' })
  @ApiParam({ name: 'id', description: 'Profession level ID' })
  @ApiResponse({ status: 200, description: 'Profession level deleted successfully' })
  @ApiResponse({ status: 404, description: 'Profession level not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.professionLevelService.remove(id);
  }
}

