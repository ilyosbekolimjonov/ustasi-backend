import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterProfessionDto } from './create-master-profession.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMasterProfessionDto extends PartialType(CreateMasterProfessionDto) {
  @ApiPropertyOptional({ description: 'Profession ID' })
  professionId?: string;

  @ApiPropertyOptional({ description: 'Minimum working hours per day' })
  minWorkingHours?: number;

  @ApiPropertyOptional({ description: 'Level ID' })
  levelId?: string;

  @ApiPropertyOptional({ description: 'Hourly price for the master' })
  priceHourly?: number;

  @ApiPropertyOptional({ description: 'Daily price for the master' })
  priceDaily?: number;

  @ApiPropertyOptional({ description: 'Experience in years' })
  experience?: number;

  @ApiPropertyOptional({ description: 'Master ID' })
  masterId?: string;
}

