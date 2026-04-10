import { Module } from '@nestjs/common';
import { CloudinaryIntegrationModule } from '../../integrations/cloudinary/cloudinary.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [CloudinaryIntegrationModule],
  providers: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {}
