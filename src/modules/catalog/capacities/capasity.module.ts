import { Module } from '@nestjs/common';
import { CapasityService } from './capasity.service';
import { CapasityController } from './capasity.controller';

@Module({
  controllers: [CapasityController],
  providers: [CapasityService],
})
export class CapasityModule {}
