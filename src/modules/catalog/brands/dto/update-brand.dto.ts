import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiProperty({
    example: 'Nike',
    description: 'Brand name in Uzbek',
    required: false,
  })
  name_uz?: string;

  @ApiProperty({
    example: 'Найк',
    description: 'Brand name in Russian',
    required: false,
  })
  name_ru?: string;

  @ApiProperty({
    example: 'Nike',
    description: 'Brand name in English',
    required: false,
  })
  name_en?: string;
}
