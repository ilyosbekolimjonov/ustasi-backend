import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSizeDto {
  @ApiProperty({ example: 'Kichik', description: 'Size name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Маленький', description: 'Size name in Russian' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ example: 'Small', description: 'Size name in English' })
  @IsString()
  @IsNotEmpty()
  name_en: string;
}

