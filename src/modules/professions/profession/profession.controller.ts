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
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ROLE } from '../../../common/constants/legacy-prisma.enums';
import { Roles } from '../../../decorators/roles.decorators';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('Profession')
@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new profession' })
  @ApiBody({ type: CreateProfessionDto })
  @ApiResponse({ status: 201, description: 'Profession successfully created' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionService.create(createProfessionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of professions with pagination, search, and filters',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'developer' })
  @ApiQuery({
    name: 'isActive',
    required: false,
    example: true,
    description: 'Filter professions based on active status',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of professions has been successfully returned',
  })
  findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: string;
    },
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    let isActive = query.isActive || ""
    return this.professionService.findAll(page, limit, search, isActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single profession by ID' })
  @ApiParam({ name: 'id', description: 'ID of the profession to fetch' })
  @ApiResponse({ status: 200, description: 'Profession found' })
  @ApiResponse({ status: 404, description: 'Profession not found' })
  findOne(@Param('id') id: string) {
    return this.professionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a profession by ID' })
  @ApiParam({ name: 'id', description: 'ID of the profession to update' })
  @ApiBody({ type: UpdateProfessionDto })
  @ApiResponse({ status: 200, description: 'Profession updated successfully' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProfessionDto: UpdateProfessionDto) {
    return this.professionService.update(id, updateProfessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a profession by ID' })
  @ApiParam({ name: 'id', description: 'ID of the profession to delete' })
  @ApiResponse({ status: 200, description: 'Profession deleted successfully' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.professionService.remove(id);
  }
}

