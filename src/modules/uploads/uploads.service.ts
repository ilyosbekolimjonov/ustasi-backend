import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { CloudinaryUploadService } from '../../integrations/cloudinary/cloudinary.service';

@Injectable()
export class UploadsService {
  constructor(private readonly cloudinaryUploadService: CloudinaryUploadService) {}

  upload(file: Express.Multer.File) {
    return this.cloudinaryUploadService.uploadImage(file);
  }
}

