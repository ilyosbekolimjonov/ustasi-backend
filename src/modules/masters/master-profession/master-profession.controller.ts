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
import { MasterProfessionService } from './master-profession.service';
import { CreateMasterProfessionDto } from './dto/create-master-profession.dto';
import { UpdateMasterProfessionDto } from './dto/update-master-profession.dto';
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

@ApiTags('Master Profession')
@Controller('master-profession')
export class MasterProfessionController {
  constructor(private readonly masterProfessionService: MasterProfessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new master profession' })
  @ApiBody({ type: CreateMasterProfessionDto })
  @ApiResponse({ status: 201, description: 'Master profession created successfully', type: CreateMasterProfessionDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createMasterProfessionDto: CreateMasterProfessionDto) {
    return this.masterProfessionService.create(createMasterProfessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all master professions with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiResponse({ status: 200, description: 'List of master professions', type: [CreateMasterProfessionDto] })
  findAll(@Query() query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return this.masterProfessionService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a master profession by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Master profession ID' })
  @ApiResponse({ status: 200, description: 'Master profession found', type: CreateMasterProfessionDto })
  @ApiResponse({ status: 404, description: 'Master profession not found' })
  findOne(@Param('id') id: string) {
    return this.masterProfessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a master profession by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Master profession ID' })
  @ApiBody({ type: UpdateMasterProfessionDto })
  @ApiResponse({ status: 200, description: 'Master profession updated successfully', type: CreateMasterProfessionDto })
  @ApiResponse({ status: 404, description: 'Master profession not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateMasterProfessionDto: UpdateMasterProfessionDto) {
    return this.masterProfessionService.update(id, updateMasterProfessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a master profession by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Master profession ID' })
  @ApiResponse({ status: 200, description: 'Master profession deleted successfully' })
  @ApiResponse({ status: 404, description: 'Master profession not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)       
  remove(@Param('id') id: string) {
    return this.masterProfessionService.remove(id);
  }
}

