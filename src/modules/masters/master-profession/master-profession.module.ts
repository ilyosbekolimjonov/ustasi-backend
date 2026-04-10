import { Module } from '@nestjs/common';
import { MasterProfessionService } from './master-profession.service';
import { MasterProfessionController } from './master-profession.controller';

@Module({
  controllers: [MasterProfessionController],
  providers: [MasterProfessionService],
})
export class MasterProfessionModule {}
