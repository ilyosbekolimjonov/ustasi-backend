import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentType, TimeUnit } from '../../../common/constants/domain.enums';

export class CreateOrderItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  professionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  toolId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  levelId?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(999)
  count!: number;

  @ApiProperty({ enum: Object.values(TimeUnit) })
  @IsIn(Object.values(TimeUnit))
  timeUnit!: TimeUnit;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(720)
  workingTime!: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  longitude!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  latitude!: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @ApiProperty({ enum: Object.values(PaymentType) })
  @IsIn(Object.values(PaymentType))
  paymentType!: PaymentType;

  @ApiProperty()
  @IsBoolean()
  withDelivery!: boolean;

  @ApiProperty()
  @IsString()
  deliveryComment!: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems!: CreateOrderItemDto[];
}
