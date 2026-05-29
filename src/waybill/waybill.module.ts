import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaybillService } from './waybill.service';
import { WaybillController } from './waybill.controller';
import { Waybill } from './waybill.entity';
import { Depot } from './depot.entity';
import { LaneRate } from './lane-rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Waybill, Depot, LaneRate]),
  ],
  providers: [WaybillService],
  controllers: [WaybillController],
})
export class WaybillModule {}
