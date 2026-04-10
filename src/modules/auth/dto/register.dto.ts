import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../../../common/constants/domain.enums';

export class RegisterDto {
  @ApiProperty({ example: 'Ali Aliyev' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'ali@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+998901234567' })
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'Phone number must be in international format',
  })
  phone!: string;

  @ApiProperty({ example: 'StrongPassword!23' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    enum: [UserRole.USER, UserRole.MASTER],
    example: UserRole.USER,
  })
  @IsIn([UserRole.USER, UserRole.MASTER])
  role!: typeof UserRole.USER | typeof UserRole.MASTER;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Santexnik' })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.MASTER)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ApiPropertyOptional({ example: 'Toshkent' })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.MASTER)
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({ example: 'Yunusobod' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: '7 yil tajriba' })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.MASTER)
  @IsString()
  @MaxLength(160)
  @IsNotEmpty()
  experienceText?: string;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @ApiPropertyOptional({
    example: 'Uy-joy va ofis santexnika ishlarida ishlayman.',
  })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.MASTER)
  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/master.jpg' })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.MASTER)
  @IsString()
  @IsNotEmpty()
  profileImageUrl?: string;
}
