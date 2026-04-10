import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { ServiceRequestStatus } from '../../../common/constants/domain.enums';

export class UpdateServiceRequestStatusDto {
  @ApiProperty({
    enum: [ServiceRequestStatus.IN_PROGRESS, ServiceRequestStatus.DONE],
  })
  @IsIn([ServiceRequestStatus.IN_PROGRESS, ServiceRequestStatus.DONE])
  status!:
    | typeof ServiceRequestStatus.IN_PROGRESS
    | typeof ServiceRequestStatus.DONE;
}
