import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderMasterDto {
  @ApiProperty({
    example: 'c6318a1e-fb17-4e71-8b58-234c85f3d7a1',
    description: 'Order ID to assign masters to',
  })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    example: [
      'a84b64c2-d273-4dcf-a0f4-d73a5795b4f3',
      'b9539a63-77c9-4e11-b3db-8395a536cfa3',
    ],
    description: 'Array of master IDs assigned to this order',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  masterIds: string[];
}
