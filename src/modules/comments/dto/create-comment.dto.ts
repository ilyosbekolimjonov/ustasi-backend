import { IsNumber, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 4.5,
    description: 'Rating given to the master (0 to 5)',
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  star: number;

  @ApiProperty({
    example: 'a7b1f432-11f0-45c3-a6cb-0c2d8d231a09',
    description: 'UUID of the master being reviewed',
  })
  @IsUUID()
  masterId: string;
}
