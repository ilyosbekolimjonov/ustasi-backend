import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAboutUsDto } from './create-about_us.dto';

export class UpdateAboutUsDto extends PartialType(CreateAboutUsDto) {
  @ApiProperty({ description: 'General information in Uzbek', required: false })
  generalInformation_uz?: string;

  @ApiProperty({
    description: 'General information in Russian',
    required: false,
  })
  generalInformation_ru?: string;

  @ApiProperty({
    description: 'General information in English',
    required: false,
  })
  generalInformation_en?: string;

  @ApiProperty({ description: 'Contact email', required: false })
  email?: string;

  @ApiProperty({ description: 'Website link', required: false })
  link?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  phone?: string;
}
