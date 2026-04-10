import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ServiceRequestStatus } from '../../../common/constants/domain.enums';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ListServiceRequestsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ enum: Object.values(ServiceRequestStatus) })
  @IsOptional()
  @IsIn(Object.values(ServiceRequestStatus))
  status?: ServiceRequestStatus;
}
