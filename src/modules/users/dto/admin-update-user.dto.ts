import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole, UserStatus } from '../../../common/constants/domain.enums';

export class AdminUpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional({ enum: Object.values(UserRole) })
  @IsOptional()
  @IsIn(Object.values(UserRole))
  role?: string;

  @ApiPropertyOptional({ enum: Object.values(UserStatus) })
  @IsOptional()
  @IsIn(Object.values(UserStatus))
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

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

