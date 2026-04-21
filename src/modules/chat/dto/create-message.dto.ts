import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message body',
    example: 'Assalomu alaykum, bugun 18:00 da bora olaman.',
  })
  @IsString()
  @MaxLength(2000)
  text: string;
}
