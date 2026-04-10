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
import { CapasityService } from './capasity.service';
import { CreateCapasityDto } from './dto/create-capasity.dto';
import { UpdateCapasityDto } from './dto/update-capasity.dto';
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

@ApiTags('Capasity')
@Controller('capasity')
export class CapasityController {
  constructor(private readonly capasityService: CapasityService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new capasity' })
  @ApiBody({ type: CreateCapasityDto })
  @ApiResponse({
    status: 201,
    description: 'Capasity created successfully',
    type: CreateCapasityDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createCapasityDto: CreateCapasityDto) {
    return this.capasityService.create(createCapasityDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all capasity records with pagination and search',
  })
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
    description: 'Returns a list of capasity records',
    type: [CreateCapasityDto],
  })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    return this.capasityService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a capasity by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Capasity ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the capasity record',
    type: CreateCapasityDto,
  })
  @ApiResponse({ status: 404, description: 'Capasity not found' })
  findOne(@Param('id') id: string) {
    return this.capasityService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a capasity by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Capasity ID' })
  @ApiBody({ type: UpdateCapasityDto })
  @ApiResponse({
    status: 200,
    description: 'Capasity updated successfully',
    type: CreateCapasityDto,
  })
  @ApiResponse({ status: 404, description: 'Capasity not found' })
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateCapasityDto: UpdateCapasityDto,
  ) {
    return this.capasityService.update(id, updateCapasityDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a capasity by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Capasity ID' })
  @ApiResponse({ status: 200, description: 'Capasity deleted successfully' })
  @ApiResponse({ status: 404, description: 'Capasity not found' })
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.capasityService.remove(id);
  }
}
