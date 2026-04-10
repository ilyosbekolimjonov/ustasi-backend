import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerDto } from './create-partner.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @ApiPropertyOptional({
    example: 'Partner Name in Uzbek',
    description: 'Updated name in Uzbek (optional)',
  })
  name_uz?: string;

  @ApiPropertyOptional({
    example: 'Partner Name in Russian',
    description: 'Updated name in Russian (optional)',
  })
  name_ru?: string;

  @ApiPropertyOptional({
    example: 'Partner Name in English',
    description: 'Updated name in English (optional)',
  })
  name_en?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.png',
    description: 'Updated image URL (optional)',
  })
  image?: string;

  @ApiPropertyOptional({
    example: 'https://example.com',
    description: 'Updated partner link (optional)',
  })
  link?: string;
}
