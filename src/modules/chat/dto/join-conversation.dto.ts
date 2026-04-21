import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinConversationDto {
  @ApiProperty({
    description: 'Conversation identifier',
    example: '0a1b2c3d-4e5f-6789-abcd-ef0123456789',
  })
  @IsString()
  conversationId: string;
}
