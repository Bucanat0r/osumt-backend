import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { DailySales } from './daily-sales.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailySales])],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
