import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @ApiProperty({
    example: "Bolg'a",
    description: 'Tool name in Uzbek',
    required: false,
  })
  name_uz?: string;

  @ApiProperty({
    example: 'Молоток',
    description: 'Tool name in Russian',
    required: false,
  })
  name_ru?: string;

  @ApiProperty({
    example: 'Hammer',
    description: 'Tool name in English',
    required: false,
  })
  name_en?: string;

  @ApiProperty({
    example: "Yog'och bolg'a",
    description: 'Tool description in Uzbek',
    required: false,
  })
  description_uz?: string;

  @ApiProperty({
    example: 'Деревянный молоток',
    description: 'Tool description in Russian',
    required: false,
  })
  description_ru?: string;

  @ApiProperty({
    example: 'Wooden hammer',
    description: 'Tool description in English',
    required: false,
  })
  description_en?: string;

  @ApiProperty({
    example: 120000,
    description: 'Price of the tool',
    required: false,
  })
  price?: number;

  @ApiProperty({
    example: 15,
    description: 'Available quantity',
    required: false,
  })
  quantity?: number;

  @ApiProperty({
    example: 1001,
    description: 'Unique product code',
    required: false,
  })
  code?: number;

  @ApiProperty({
    example: 'tool.jpg',
    description: 'Image filename or URL',
    required: false,
  })
  image?: string;

  @ApiProperty({
    example: true,
    description: 'Availability status',
    required: false,
  })
  isAvailable?: boolean;

  @ApiProperty({
    example: 'brand-id-123',
    description: 'Related brand ID',
    required: false,
  })
  brandId?: string;

  @ApiProperty({
    example: 'capasity-id-456',
    description: 'Related capacity ID',
    required: false,
  })
  capasityId?: string;

  @ApiProperty({
    example: 'size-id-789',
    description: 'Related size ID',
    required: false,
  })
  sizeId?: string;
}
