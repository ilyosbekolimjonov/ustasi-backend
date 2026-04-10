import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @ApiProperty({ example: 'Boshlangʻich', description: 'Level name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Начальный', description: 'Level name in Russian' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ example: 'Beginner', description: 'Level name in English' })
  @IsString()
  @IsNotEmpty()
  name_en: string;
}
