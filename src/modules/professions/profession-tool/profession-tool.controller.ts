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
import { ProfessionToolService } from './profession-tool.service';
import { CreateProfessionToolDto } from './dto/create-profession-tool.dto';
import { UpdateProfessionToolDto } from './dto/update-profession-tool.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ROLE } from '../../../common/constants/legacy-prisma.enums';
import { Roles } from '../../../decorators/roles.decorators';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('ProfessionTool')
@Controller('profession-tool')
export class ProfessionToolController {
  constructor(private readonly professionToolService: ProfessionToolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new profession-tool relation' })
  @ApiResponse({
    status: 201,
    description: 'Profession tool created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createProfessionToolDto: CreateProfessionToolDto) {
    return this.professionToolService.create(createProfessionToolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all profession-tool relations' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of profession-tool relations',
  })
  findAll(@Query() query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return this.professionToolService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific profession-tool relation by ID' })
  @ApiParam({ name: 'id', description: 'Profession tool ID' })
  @ApiResponse({ status: 200, description: 'Profession tool found' })
  @ApiResponse({ status: 404, description: 'Profession tool not found' })
  findOne(@Param('id') id: string) {
    return this.professionToolService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a profession-tool relation by ID' })
  @ApiParam({ name: 'id', description: 'Profession tool ID' })
  @ApiResponse({
    status: 200,
    description: 'Profession tool updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Profession tool not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateProfessionToolDto: UpdateProfessionToolDto,
  ) {
    return this.professionToolService.update(id, updateProfessionToolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a profession-tool relation by ID' })
  @ApiParam({ name: 'id', description: 'Profession tool ID' })
  @ApiResponse({
    status: 200,
    description: 'Profession tool deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Profession tool not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.professionToolService.remove(id);
  }
}
