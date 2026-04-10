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
import { ContactUsService } from './contact_us.service';
import { CreateContactUsDto } from './dto/create-contact_us.dto';
import { UpdateContactUsDto } from './dto/update-contact_us.dto';
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

@ApiTags('Contact Us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact message' })
  @ApiBody({ type: CreateContactUsDto })
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
    type: CreateContactUsDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.contactUsService.create(createContactUsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all contact messages with pagination and search',
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
    description: 'List of contact messages',
    type: [CreateContactUsDto],
  })
  findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    return this.contactUsService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact message by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Contact message ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact message data',
    type: CreateContactUsDto,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  findOne(@Param('id') id: string) {
    return this.contactUsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact message by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Contact message ID' })
  @ApiBody({ type: UpdateContactUsDto })
  @ApiResponse({
    status: 200,
    description: 'Contact message updated successfully',
    type: CreateContactUsDto,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateContactUsDto: UpdateContactUsDto,
  ) {
    return this.contactUsService.update(id, updateContactUsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Contact message ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact message deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.contactUsService.remove(id);
  }
}
