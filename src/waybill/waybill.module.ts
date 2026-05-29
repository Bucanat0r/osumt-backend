import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaybillService } from './waybill.service';
import { WaybillController } from './waybill.controller';
import { Waybill } from './waybill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Waybill])],
  controllers: [WaybillController],
  providers: [WaybillService],
  exports: [WaybillService],
})
export class WaybillModule {}
