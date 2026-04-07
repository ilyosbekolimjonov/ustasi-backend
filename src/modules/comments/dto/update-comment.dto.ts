import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiPropertyOptional({ example: 3.5, description: 'Optional updated star rating' })
  star?: number;

  @ApiPropertyOptional({ example: 'a7b1f432-11f0-45c3-a6cb-0c2d8d231a09', description: 'Optional new masterId' })
  masterId?: string;
}

