import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ example: 'Savol nima?', description: 'Question in Uzbek' })
  @IsString()
  @IsNotEmpty()
  question_uz: string;

  @ApiProperty({ example: 'Вопрос какой?', description: 'Question in Russian' })
  @IsString()
  @IsNotEmpty()
  question_ru: string;

  @ApiProperty({ example: 'What is the question?', description: 'Question in English' })
  @IsString()
  @IsNotEmpty()
  question_en: string;

  @ApiProperty({ example: 'Bu savolga javob.', description: 'Answer in Uzbek' })
  @IsString()
  @IsNotEmpty()
  answer_uz: string;

  @ApiProperty({ example: 'Это ответ на вопрос.', description: 'Answer in Russian' })
  @IsString()
  @IsNotEmpty()
  answer_ru: string;

  @ApiProperty({ example: 'This is the answer.', description: 'Answer in English' })
  @IsString()
  @IsNotEmpty()
  answer_en: string;
}

