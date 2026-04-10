import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMasterDto {
  @ApiProperty({ example: 'Ali', description: 'Master firstname' })
  @IsString()
  @IsNotEmpty()
  firstname!: string;

  @ApiProperty({ example: 'Aliyev', description: 'Master lastname' })
  @IsString()
  @IsNotEmpty()
  lastname!: string;

  @ApiProperty({ example: '+998901234567', description: 'Master phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ example: 2024, description: 'Year of starting profession' })
  @IsNumber()
  @IsNotEmpty()
  year!: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Profile image URL',
  })
  @IsString()
  @IsNotEmpty()
  image!: string;

  @ApiProperty({
    example: 'https://example.com/passport.jpg',
    description: 'Passport image URL',
  })
  @IsString()
  @IsNotEmpty()
  pasportImage!: string;

  @ApiProperty({
    example: 'Certified master with 5 years of experience',
    description: 'About master',
  })
  @IsString()
  @IsNotEmpty()
  about!: string;
}
