import { Module } from '@nestjs/common';
import { OrderMasterService } from './order-master.service';
import { OrderMasterController } from './order-master.controller';

@Module({
  controllers: [OrderMasterController],
  providers: [OrderMasterService],
})
export class OrderMasterModule {}
