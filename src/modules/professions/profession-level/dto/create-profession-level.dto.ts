import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionLevelDto {
  @ApiProperty({
    example: 'e9a85f7d-6e6b-4701-9c88-4b871debd01a',
    description: 'UUID of the profession',
  })
  @IsString()
  @IsNotEmpty()
  professionId: string;

  @ApiProperty({
    example: '7a216d65-1497-4e89-a65e-8dc55b937738',
    description: 'UUID of the level',
  })
  @IsString()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({
    example: 40,
    description: 'Minimum working hours required',
  })
  @IsNumber()
  @IsNotEmpty()
  minWorkingHours: number;

  @ApiProperty({
    example: 25000,
    description: 'Hourly price in UZS',
  })
  @IsNumber()
  @IsNotEmpty()
  priceHourly: number;

  @ApiProperty({
    example: 180000,
    description: 'Daily price in UZS',
  })
  @IsNumber()
  @IsNotEmpty()
  priceDaily: number;
}
