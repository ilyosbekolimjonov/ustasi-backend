import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMasterProfessionDto {
  @ApiProperty({ example: '12345', description: 'Profession ID' })
  @IsString()
  @IsNotEmpty()
  professionId: string;

  @ApiProperty({ example: 40, description: 'Minimum working hours per day' })
  @IsNumber()
  @IsNotEmpty()
  minWorkingHours: number;

  @ApiProperty({ example: '67890', description: 'Level ID' })
  @IsString()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({ example: 20, description: 'Hourly price for the master' })
  @IsNumber()
  @IsNotEmpty()
  priceHourly: number;

  @ApiProperty({ example: 160, description: 'Daily price for the master' })
  @IsNumber()
  @IsNotEmpty()
  priceDaily: number;

  @ApiProperty({ example: 5, description: 'Experience in years' })
  @IsNumber()
  @IsNotEmpty()
  experience: number;

  @ApiProperty({ example: '54321', description: 'Master ID' })
  @IsString()
  @IsNotEmpty()
  masterId: string;
}
