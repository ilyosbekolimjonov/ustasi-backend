import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateToolDto {
  @ApiProperty({ example: 'Bolg\'a', description: 'Tool name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Молоток', description: 'Tool name in Russian' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ example: 'Hammer', description: 'Tool name in English' })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ example: 'Yog\'och bolg\'a', description: 'Tool description in Uzbek' })
  @IsString()
  @IsNotEmpty()
  description_uz: string;

  @ApiProperty({ example: 'Деревянный молоток', description: 'Tool description in Russian' })
  @IsString()
  @IsNotEmpty()
  description_ru: string;

  @ApiProperty({ example: 'Wooden hammer', description: 'Tool description in English' })
  @IsString()
  @IsNotEmpty()
  description_en: string;

  @ApiProperty({ example: 120000, description: 'Price of the tool' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 15, description: 'Available quantity' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 1001, description: 'Unique product code' })
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @ApiPropertyOptional({ example: 'tool.jpg', description: 'Image filename or URL' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ example: true, description: 'Availability status' })
  @IsBoolean()
  isAvailable: boolean;

  @ApiPropertyOptional({ example: 'brand-id-123', description: 'Related brand ID' })
  @IsString()
  @IsOptional()
  brandId: string;

  @ApiPropertyOptional({ example: 'capasity-id-456', description: 'Related capacity ID' })
  @IsString()
  @IsOptional()
  capasityId: string;

  @ApiPropertyOptional({ example: 'size-id-789', description: 'Related size ID' })
  @IsString()
  @IsOptional()
  sizeId: string;
}

