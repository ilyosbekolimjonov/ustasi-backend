import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderMasterDto } from './create-order-master.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderMasterDto extends PartialType(CreateOrderMasterDto) {
  @ApiPropertyOptional({
    example: 'c6318a1e-fb17-4e71-8b58-234c85f3d7a1',
    description: 'Updated order ID (optional)'
  })
  orderId?: string;

  @ApiPropertyOptional({
    example: [
      'a84b64c2-d273-4dcf-a0f4-d73a5795b4f3',
      'b9539a63-77c9-4e11-b3db-8395a536cfa3'
    ],
    description: 'Updated array of master IDs (optional)',
    type: [String]
  })
  masterIds?: string[];
}

