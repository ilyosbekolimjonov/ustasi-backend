import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsUUID, Max, Min } from 'class-validator';
import { TimeUnit } from '../../../common/constants/domain.enums';

export class CreateBasketItemDto {
  @ApiProperty()
  @IsUUID()
  professionId!: string;

  @ApiProperty()
  @IsUUID()
  toolId!: string;

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

  @ApiProperty()
  @IsUUID()
  levelId!: string;
}
