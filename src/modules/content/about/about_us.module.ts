import { Module } from '@nestjs/common';
import { AboutUsService } from './about_us.service';
import { AboutUsController } from './about_us.controller';

@Module({
  controllers: [AboutUsController],
  providers: [AboutUsService],
})
export class AboutUsModule {}
