import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class CloudinaryUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File) {
    const { public_id, secure_url, width, height, bytes, format } =
      await this.cloudinaryService.uploadFile(file);

    return {
      publicId: public_id,
      url: secure_url,
      width,
      height,
      bytes,
      format,
    };
  }
}
