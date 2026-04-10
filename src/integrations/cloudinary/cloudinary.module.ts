import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { CloudinaryConfig } from '../../config/cloudinary.config';
import { CloudinaryUploadService } from './cloudinary.service';

@Module({
  imports: [
    CloudinaryModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cloudinary =
          configService.getOrThrow<CloudinaryConfig>('cloudinary');

        return {
          cloud_name: cloudinary.cloudName,
          api_key: cloudinary.apiKey,
          api_secret: cloudinary.apiSecret,
        };
      },
    }),
  ],
  providers: [CloudinaryUploadService],
  exports: [CloudinaryUploadService],
})
export class CloudinaryIntegrationModule {}
