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
import { OrderMasterService } from './order-master.service';
import { CreateOrderMasterDto } from './dto/create-order-master.dto';
import { UpdateOrderMasterDto } from './dto/update-order-master.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ROLE } from '../../../common/constants/legacy-prisma.enums';
import { Roles } from '../../../decorators/roles.decorators';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';


@ApiTags('Order Master')
@Controller('order-master')
export class OrderMasterController {
  constructor(private readonly orderMasterService: OrderMasterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order-master record' })
  @ApiBody({ type: CreateOrderMasterDto })
  @ApiResponse({ status: 201, description: 'Order-master created successfully' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createOrderMasterDto: CreateOrderMasterDto) {
    return this.orderMasterService.create(createOrderMasterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order-master records with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return this.orderMasterService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one order-master by ID' })
  @ApiParam({ name: 'id', example: '0fcdca36-d3e1-4b9c-bb94-1a0ea9339b47' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.orderMasterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order-master by ID' })
  @ApiParam({ name: 'id', example: '0fcdca36-d3e1-4b9c-bb94-1a0ea9339b47' })
  @ApiBody({ type: UpdateOrderMasterDto })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateOrderMasterDto: UpdateOrderMasterDto) {
    return this.orderMasterService.update(id, updateOrderMasterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order-master by ID' })
  @ApiParam({ name: 'id', example: '0fcdca36-d3e1-4b9c-bb94-1a0ea9339b47' })
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.orderMasterService.remove(id);
  }
}

