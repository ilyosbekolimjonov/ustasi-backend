import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionDto } from './create-profession.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfessionDto extends PartialType(CreateProfessionDto) {
  @ApiPropertyOptional({ description: 'Profession name in Uzbek' })
  name_uz?: string;

  @ApiPropertyOptional({ description: 'Profession name in Russian' })
  name_ru?: string;

  @ApiPropertyOptional({ description: 'Profession name in English' })
  name_en?: string;

  @ApiPropertyOptional({ description: 'Image URL for the profession' })
  image?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the profession is active. Optional.',
  })
  isActive?: boolean;
}
