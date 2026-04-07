import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SelfUpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  regionId?: string;

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

