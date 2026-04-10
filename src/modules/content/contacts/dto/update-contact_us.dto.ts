import { PartialType } from '@nestjs/mapped-types';
import { CreateContactUsDto } from './create-contact_us.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactUsDto extends PartialType(CreateContactUsDto) {
  @ApiProperty({ description: 'First name of the user', required: false })
  firstname?: string;

  @ApiProperty({ description: 'Last name of the user', required: false })
  lastname?: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  phone?: string;

  @ApiProperty({ description: 'Address of the user', required: false })
  address?: string;

  @ApiProperty({ description: 'Message from the user', required: false })
  message?: string;
}
