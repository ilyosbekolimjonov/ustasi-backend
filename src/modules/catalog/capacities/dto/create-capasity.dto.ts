import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCapasityDto {
  @ApiProperty({ example: '1 litr', description: 'Capacity name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: '1 литр', description: 'Capacity name in Russian' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ example: '1 liter', description: 'Capacity name in English' })
  @IsString()
  @IsNotEmpty()
  name_en: string;
}
