import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactUsDto {
  @ApiProperty({ example: 'Ali', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Valiyev', description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of the user',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'Tashkent, Uzbekistan',
    description: 'Address of the user',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'I have a question about your services.',
    description: 'Message from the user',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
