// create-about_us.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAboutUsDto {
  @ApiProperty({
    description: 'General information in Uzbek',
    example: 'Biz haqimizda',
  })
  @IsString()
  @IsNotEmpty()
  generalInformation_uz: string;

  @ApiProperty({
    description: 'General information in Russian',
    example: 'О нас',
  })
  @IsString()
  @IsNotEmpty()
  generalInformation_ru: string;

  @ApiProperty({
    description: 'General information in English',
    example: 'About us',
  })
  @IsString()
  @IsNotEmpty()
  generalInformation_en: string;

  @ApiProperty({ description: 'Contact email', example: 'contact@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Website link', example: 'https://example.com' })
  @IsString()
  @IsNotEmpty()
  link: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+998 90 123 45 67',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
