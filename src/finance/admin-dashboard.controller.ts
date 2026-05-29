import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySales } from './daily-sales.entity';
import { Waybill } from '../waybill/waybill.entity';

@Controller('admin')
export class AdminDashboardController {
  constructor(
    @InjectRepository(DailySales) private salesRepo: Repository<DailySales>,
    @InjectRepository(Waybill) private waybillRepo: Repository<Waybill>,
  ) {}

  @Get('dashboard')
  async getDashboardMetrics() {
    // 1. Pull metrics for high level card data summaries
    const salesData = await this.salesRepo.find();
    
    let totalGross = 0;
    let totalExpenses = 0;
    let totalExpectedBank = 0;
    let totalActualBanked = 0;

    salesData.forEach(day => {
      totalGross += Number(day.gross_sales);
      totalExpenses += Number(day.expenses);
      totalExpectedBank += Number(day.expected_bank);
      totalActualBanked += Number(day.actual_banked);
    });

    // 2. Query out non-compliant operational anomaly flags dynamically
    const bankDeltaFlags = salesData
      .filter(day => day.had_mismatch)
      .map(day => ({
        id: day.id,
        type: 'Bank Delta Mismatch',
        description: `Depot posted variance of ₦${Number(day.bank_delta).toLocaleString()} on ${day.posting_date}`,
        severity: 'Critical',
        resolved: Number(day.bank_delta) === 0,
      }));

    const overrideWaybills = await this.waybillRepo.find({ where: { had_override: true } });
    const discountFlags = overrideWaybills.map(wb => ({
      id: wb.id,
      type: 'Rate Manipulation Override',
      description: `Waybill ${wb.waybill_no} charged ₦${Number(wb.final_charged_price).toLocaleString()} instead of standard ₦${Number(wb.official_calculated_price).toLocaleString()}`,
      severity: 'Warning',
      resolved: wb.is_discount_approved,
    }));

    return {
      cards: {
        grossSales: totalGross,
        expenses: totalExpenses,
        expectedBank: totalExpectedBank,
        actualBanked: totalActualBanked,
        netDelta: totalActualBanked - totalExpectedBank,
      },
      flags: [...bankDeltaFlags, ...discountFlags], // Combines anomaly arrays into a unified log view
    };
  }
}
