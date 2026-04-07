import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionLevelDto } from './create-profession-level.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfessionLevelDto extends PartialType(CreateProfessionLevelDto) {
  @ApiPropertyOptional({
    example: 'e9a85f7d-6e6b-4701-9c88-4b871debd01a',
    description: 'UUID of the profession',
  })
  @IsString()
  @IsOptional()
  professionId?: string;

  @ApiPropertyOptional({
    example: '7a216d65-1497-4e89-a65e-8dc55b937738',
    description: 'UUID of the level',
  })
  @IsString()
  @IsOptional()
  levelId?: string;

  @ApiPropertyOptional({
    example: 40,
    description: 'Minimum working hours required',
  })
  @IsNumber()
  @IsOptional()
  minWorkingHours?: number;

  @ApiPropertyOptional({
    example: 25000,
    description: 'Hourly price in UZS',
  })
  @IsNumber()
  @IsOptional()
  priceHourly?: number;

  @ApiPropertyOptional({
    example: 180000,
    description: 'Daily price in UZS',
  })
  @IsNumber()
  @IsOptional()
  priceDaily?: number;
}

