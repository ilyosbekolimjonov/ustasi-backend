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
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorators';
import { ROLE } from '../../common/constants/legacy-prisma.enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Tool')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tool' })
  @ApiBody({ type: CreateToolDto })
  @ApiResponse({ status: 201, description: 'Tool successfully created' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tools with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'hammer' })
  @ApiQuery({ name: 'brandName', required: false, example: 'Makita' })
  @ApiQuery({ name: 'capasityName', required: false, example: 'Large' })
  @ApiQuery({ name: 'sizeName', required: false, example: 'M' })
  @ApiQuery({ name: 'priceFrom', required: false, example: 100 })
  @ApiQuery({ name: 'priceTo', required: false, example: 500 })
  @ApiResponse({
    status: 200,
    description: 'List of tools returned successfully',
  })
  findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      search?: string;
      brandName?: string;
      capasityName?: string;
      sizeName?: string;
      priceFrom?: number;
      priceTo?: number;
    },
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';

    return this.toolService.findAll(
      page,
      limit,
      search,
      query.brandName,
      query.capasityName,
      query.sizeName,
      query.priceFrom,
      query.priceTo,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tool by ID' })
  @ApiParam({ name: 'id', description: 'Tool ID' })
  @ApiResponse({ status: 200, description: 'Tool found successfully' })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tool by ID' })
  @ApiParam({ name: 'id', description: 'Tool ID' })
  @ApiBody({ type: UpdateToolDto })
  @ApiResponse({ status: 200, description: 'Tool updated successfully' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(id, updateToolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tool by ID' })
  @ApiParam({ name: 'id', description: 'Tool ID' })
  @ApiResponse({ status: 200, description: 'Tool deleted successfully' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.toolService.remove(id);
  }
}
