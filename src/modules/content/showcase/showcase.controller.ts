import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { ShowcaseService } from './showcase.service'
import { CreateShowcaseDto } from './dto/create-showcase.dto'
import { UpdateShowcaseDto } from './dto/update-showcase.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { Roles } from '../../../decorators/roles.decorators'
import { ROLE } from '../../../common/constants/legacy-prisma.enums'
import { AuthGuard } from '../../../common/guards/auth.guard'
import { RolesGuard } from '../../../common/guards/roles.guard'


@ApiTags('Showcase')
@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new showcase' })
  @ApiBody({ type: CreateShowcaseDto })
  @ApiResponse({ status: 201, description: 'Showcase created successfully', type: CreateShowcaseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcaseService.create(createShowcaseDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all showcases with pagination and search' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search keyword', type: String })
  @ApiResponse({ status: 200, description: 'List of showcases', type: [CreateShowcaseDto] })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const search = query.search || ''
    return this.showcaseService.findAll(page, limit, search)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showcase by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Showcase ID' })
  @ApiResponse({ status: 200, description: 'Showcase found', type: CreateShowcaseDto })
  @ApiResponse({ status: 404, description: 'Showcase not found' })
  findOne(@Param('id') id: string) {
    return this.showcaseService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a showcase by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Showcase ID' })
  @ApiBody({ type: UpdateShowcaseDto })
  @ApiResponse({ status: 200, description: 'Showcase updated successfully', type: CreateShowcaseDto })
  @ApiResponse({ status: 404, description: 'Showcase not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateShowcaseDto: UpdateShowcaseDto) {
    return this.showcaseService.update(id, updateShowcaseDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a showcase by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Showcase ID' })
  @ApiResponse({ status: 200, description: 'Showcase deleted successfully' })
  @ApiResponse({ status: 404, description: 'Showcase not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.showcaseService.remove(id)
  }
}

