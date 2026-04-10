import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShowcaseDto {
  @ApiProperty({
    example: "Ko'rgazma nomi (uz)",
    description: 'Showcase name in Uzbek',
  })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Название витрины (ru)',
    description: 'Showcase name in Russian',
  })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({
    example: 'Showcase name (en)',
    description: 'Showcase name in English',
  })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({
    example: "Ko'rgazma tavsifi (uz)",
    description: 'Description in Uzbek',
  })
  @IsString()
  @IsNotEmpty()
  description_uz: string;

  @ApiProperty({
    example: 'Описание витрины (ru)',
    description: 'Description in Russian',
  })
  @IsString()
  @IsNotEmpty()
  description_ru: string;

  @ApiProperty({
    example: 'Showcase description (en)',
    description: 'Description in English',
  })
  @IsString()
  @IsNotEmpty()
  description_en: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'https://example.com', description: 'External link' })
  @IsString()
  @IsNotEmpty()
  link: string;
}
