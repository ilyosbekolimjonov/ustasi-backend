import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfessionDto {
  @ApiProperty({
    example: 'Developer',
    description: 'Profession name in Uzbek',
  })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Разработчик',
    description: 'Profession name in Russian',
  })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({
    example: 'Developer',
    description: 'Profession name in English',
  })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL for the profession',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the profession is active. Optional.',
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
