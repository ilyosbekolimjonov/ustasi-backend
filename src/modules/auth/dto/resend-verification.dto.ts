import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({ example: 'ali@gmail.com' })
  @IsEmail()
  email!: string;
}
