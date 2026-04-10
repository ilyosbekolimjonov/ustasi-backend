import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterDto } from './create-master.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMasterDto extends PartialType(CreateMasterDto) {
  @ApiPropertyOptional({ description: 'Master firstname' })
  firstname?: string;

  @ApiPropertyOptional({ description: 'Master lastname' })
  lastname?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Year of experience' })
  year?: number;

  @ApiPropertyOptional({ description: 'Image URL' })
  image?: string;

  @ApiPropertyOptional({ description: 'Passport image URL' })
  pasportImage?: string;

  @ApiPropertyOptional({ description: 'About master' })
  about?: string;
}
