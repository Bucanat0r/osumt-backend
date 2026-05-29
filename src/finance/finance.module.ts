import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { DailySales } from './daily-sales.entity';
import { Waybill } from '../waybill/waybill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailySales, Waybill])],
  controllers: [FinanceController, AdminDashboardController],
  providers: [FinanceService],
})
export class FinanceModule {}
