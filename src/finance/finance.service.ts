import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySales } from './daily-sales.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(DailySales)
    private salesRepository: Repository<DailySales>,
  ) {}

  async postDailySales(clerkId: number, dto: any) {
    const cashPos = Number(dto.cash_pos);
    const credit = Number(dto.credit);
    const grossSales = Number(dto.gross_sales);
    const expenses = Number(dto.expenses || 0);
    const creditPaid = Number(dto.credit_paid || 0);
    const actualBanked = Number(dto.actual_banked);

    // Rule 1 Validation: Cash/POS + Credit MUST exactly equal Gross Sales
    if (cashPos + credit !== grossSales) {
      throw new BadRequestException(
        `Bookkeeping Error: Cash/POS (₦${cashPos}) + Credit (₦${credit}) does not equal Gross Sales (₦${grossSales}).`
      );
    }

    // Rule 2 Automation: 5% Remittance is calculated directly on total gross sales
    const remittanceDeduction = grossSales * 0.05;

    // Rule 3 Automation: Apply Expected Bank math formula
    const expectedBank = grossSales - remittanceDeduction - expenses + creditPaid;

    // Rule 4 Automation: Calculate Bank Variance Delta (Shortage/Surplus)
    const bankDelta = actualBanked - expectedBank;

    const record = this.salesRepository.create({
      depot_id: dto.depot_id || 1,
      clerk_id: clerkId,
      posting_date: dto.posting_date || new Date().toISOString().split('T')[0],
      cash_pos: cashPos,
      credit: credit,
      gross_sales: grossSales,
      expenses: expenses,
      credit_paid: creditPaid,
      remittance_deduction: remittanceDeduction,
      expected_bank: expectedBank,
      actual_banked: actualBanked,
      bank_delta: bankDelta,
      bank_proof_url: dto.bank_proof_url || 'https://storage.osumtgo.com/proofs/mock-slip.jpg', // Placeholder for now
      is_locked: true, // Lock day report on successful submission
    });

    return await this.salesRepository.save(record);
  }
}
