import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({
    example: "Qoraqalpog'iston",
    description: 'Viloyat name in Uzbek',
  })
  @IsString()
  name_uz: string;

  @ApiProperty({
    example: 'Каракалпакстан',
    description: 'Viloyat name in Russian',
  })
  @IsString()
  name_ru: string;

  @ApiProperty({
    example: 'Karakalpakstan',
    description: 'Viloyat name in English',
  })
  @IsString()
  name_en: string;
}
