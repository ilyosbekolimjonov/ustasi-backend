import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqDto } from './create-faq.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
  @ApiProperty({ description: 'Question in Uzbek', required: false })
  question_uz?: string;

  @ApiProperty({ description: 'Question in Russian', required: false })
  question_ru?: string;

  @ApiProperty({ description: 'Question in English', required: false })
  question_en?: string;

  @ApiProperty({ description: 'Answer in Uzbek', required: false })
  answer_uz?: string;

  @ApiProperty({ description: 'Answer in Russian', required: false })
  answer_ru?: string;

  @ApiProperty({ description: 'Answer in English', required: false })
  answer_en?: string;
}
