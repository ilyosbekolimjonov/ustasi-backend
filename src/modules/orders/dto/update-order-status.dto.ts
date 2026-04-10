import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { OrderStatus } from '../../../common/constants/domain.enums';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: Object.values(OrderStatus) })
  @IsIn(Object.values(OrderStatus))
  status!: OrderStatus;
}
