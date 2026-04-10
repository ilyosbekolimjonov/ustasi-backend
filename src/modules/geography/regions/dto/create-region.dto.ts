import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({
    example: "Qoraqalpog'iston",
    description: 'Region name in Uzbek',
  })
  @IsString()
  name_uz: string;

  @ApiProperty({
    example: 'Каракалпакстан',
    description: 'Region name in Russian',
  })
  @IsString()
  name_ru: string;

  @ApiProperty({
    example: 'Karakalpakstan',
    description: 'Region name in English',
  })
  @IsString()
  name_en: string;
}
