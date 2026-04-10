import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeDto } from './create-size.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  @ApiProperty({
    example: 'Kichik',
    description: 'Size name in Uzbek',
    required: false,
  })
  name_uz?: string;

  @ApiProperty({
    example: 'Маленький',
    description: 'Size name in Russian',
    required: false,
  })
  name_ru?: string;

  @ApiProperty({
    example: 'Small',
    description: 'Size name in English',
    required: false,
  })
  name_en?: string;
}
