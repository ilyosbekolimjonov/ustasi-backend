import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionToolDto {
  @ApiProperty({
    example: 'b2ad614d-934a-4b52-bd73-11905f36a1b3',
    description: 'UUID of the profession',
  })
  @IsString()
  @IsNotEmpty()
  professionId: string;

  @ApiProperty({
    example: '39c8924d-8033-4b7a-85f4-d6a5e48eac1a',
    description: 'UUID of the tool',
  })
  @IsString()
  @IsNotEmpty()
  toolId: string;
}
