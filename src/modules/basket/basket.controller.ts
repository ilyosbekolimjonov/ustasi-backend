import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { BasketService } from './basket.service';
import { CreateBasketItemDto } from './dto/create-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';

@ApiTags('Basket')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a basket item for the authenticated user' })
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateBasketItemDto) {
    return this.basketService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List only the authenticated user basket items' })
  findMine(
    @CurrentUser('sub') userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.basketService.findMine(userId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single basket item owned by the current user',
  })
  findOne(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.basketService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a basket item owned by the current user' })
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBasketItemDto,
  ) {
    return this.basketService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a basket item owned by the current user' })
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.basketService.remove(userId, id);
  }
}
