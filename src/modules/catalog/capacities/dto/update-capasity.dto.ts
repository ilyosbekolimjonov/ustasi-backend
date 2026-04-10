import { PartialType } from '@nestjs/mapped-types';
import { CreateCapasityDto } from './create-capasity.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCapasityDto extends PartialType(CreateCapasityDto) {
  @ApiProperty({ description: 'Capacity name in Uzbek', required: false })
  name_uz?: string;

  @ApiProperty({ description: 'Capacity name in Russian', required: false })
  name_ru?: string;

  @ApiProperty({ description: 'Capacity name in English', required: false })
  name_en?: string;
}
