import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiProperty({ example: 'Tashkent Electronics', description: 'Name of the partner in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Ташкент Электроника', description: 'Name of the partner in Russian' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ example: 'Tashkent Electronics', description: 'Name of the partner in English' })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ example: 'image_url_here', description: 'Image URL of the partner' })
  @IsString()
  image: string;

  @ApiPropertyOptional({ example: 'http://link-to-partner-website.com', description: 'Link to the partner website (optional)' })
  @IsString()
  @IsOptional()
  link: string;
}

