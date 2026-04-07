import { PartialType } from '@nestjs/mapped-types';
import { CreateRegionDto } from './create-region.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @ApiProperty({ example: "Qoraqalpog'iston", description: 'Region name in Uzbek', required: false })
  name_uz?: string;

  @ApiProperty({ example: 'Каракалпакстан', description: 'Region name in Russian', required: false })
  name_ru?: string;

  @ApiProperty({ example: 'Karakalpakstan', description: 'Region name in English', required: false })
  name_en?: string;
}

