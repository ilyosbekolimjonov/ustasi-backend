import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelDto } from './create-level.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLevelDto extends PartialType(CreateLevelDto) {
  @ApiPropertyOptional({ description: 'Level name in Uzbek' })
  name_uz?: string;

  @ApiPropertyOptional({ description: 'Level name in Russian' })
  name_ru?: string;

  @ApiPropertyOptional({ description: 'Level name in English' })
  name_en?: string;
}
