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
import { AboutUsService } from './about_us.service';
import { CreateAboutUsDto } from './dto/create-about_us.dto';
import { UpdateAboutUsDto } from './dto/update-about_us.dto';
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

@ApiTags('About Us')
@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new about us information' })
  @ApiBody({ type: CreateAboutUsDto })
  @ApiResponse({
    status: 201,
    description: 'About Us information has been successfully created.',
    type: CreateAboutUsDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createAboutUsDto: CreateAboutUsDto) {
    return this.aboutUsService.create(createAboutUsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all about us information with pagination and search',
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
    description: 'Search term',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all about us information',
    type: [CreateAboutUsDto],
  })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    return this.aboutUsService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find about us information by ID' })
  @ApiParam({ name: 'id', required: true, description: 'About Us ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the about us information',
    type: CreateAboutUsDto,
  })
  @ApiResponse({ status: 404, description: 'About Us information not found' })
  findOne(@Param('id') id: string) {
    return this.aboutUsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update about us information' })
  @ApiParam({ name: 'id', required: true, description: 'About Us ID' })
  @ApiBody({ type: UpdateAboutUsDto })
  @ApiResponse({
    status: 200,
    description: 'About Us information has been successfully updated',
    type: CreateAboutUsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'About Us information not found' })
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateAboutUsDto: UpdateAboutUsDto) {
    return this.aboutUsService.update(id, updateAboutUsDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete about us information' })
  @ApiParam({ name: 'id', required: true, description: 'About Us ID' })
  @ApiResponse({
    status: 200,
    description: 'About Us information has been successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'About Us information not found' })
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.aboutUsService.remove(id);
  }
}
