import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Ali Aliyev' })
  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @ApiProperty({ example: 'ali@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'StrongPassword!23' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: '9cb28b9d-4504-4c1e-8d42-8047f0c5ef5b' })
  @IsUUID()
  regionId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rs?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  oked?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;
}

