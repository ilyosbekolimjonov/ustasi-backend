import { Module } from '@nestjs/common';
import { TelegramModule } from '../../integrations/telegram/telegram.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TelegramModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
