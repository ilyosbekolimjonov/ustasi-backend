import { PartialType } from '@nestjs/mapped-types';
import { CreateShowcaseDto } from './create-showcase.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShowcaseDto extends PartialType(CreateShowcaseDto) {
  @ApiProperty({
    example: 'Ko‘rgazma nomi',
    description: 'Showcase name in Uzbek',
    required: false,
  })
  name_uz?: string;

  @ApiProperty({
    example: 'Название выставки',
    description: 'Showcase name in Russian',
    required: false,
  })
  name_ru?: string;

  @ApiProperty({
    example: 'Showcase name',
    description: 'Showcase name in English',
    required: false,
  })
  name_en?: string;

  @ApiProperty({
    example: 'Bu yerda ko‘rgazma haqida ma’lumot',
    description: 'Description in Uzbek',
    required: false,
  })
  description_uz?: string;

  @ApiProperty({
    example: 'Описание выставки на русском',
    description: 'Description in Russian',
    required: false,
  })
  description_ru?: string;

  @ApiProperty({
    example: 'Showcase description in English',
    description: 'Description in English',
    required: false,
  })
  description_en?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
    required: false,
  })
  image?: string;

  @ApiProperty({
    example: 'https://example.com',
    description: 'External showcase link',
    required: false,
  })
  link?: string;
}
