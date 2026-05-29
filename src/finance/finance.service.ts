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
      bank_proof_url: dto.bank_proof_url || 'https://storage.osumtgo.com/proofs/mock-slip.jpg',
      is_locked: true,
      had_mismatch: bankDelta !== 0,
    });

    return await this.salesRepository.save(record);
  }

  async findOneDailySales(id: number) {
    const record = await this.salesRepository.findOne({ where: { id } });
    if (!record) {
      throw new BadRequestException(`Daily sales record with ID ${id} not found`);
    }
    return record;
  }

  async updateDailySales(id: number, dto: any) {
    const record = await this.salesRepository.findOne({ where: { id } });
    if (!record) {
      throw new BadRequestException(`Daily sales record with ID ${id} not found`);
    }

    if (dto.cash_pos !== undefined) record.cash_pos = Number(dto.cash_pos);
    if (dto.credit !== undefined) record.credit = Number(dto.credit);
    if (dto.gross_sales !== undefined) record.gross_sales = Number(dto.gross_sales);
    if (dto.expenses !== undefined) record.expenses = Number(dto.expenses);
    if (dto.credit_paid !== undefined) record.credit_paid = Number(dto.credit_paid);
    if (dto.actual_banked !== undefined) record.actual_banked = Number(dto.actual_banked);
    if (dto.posting_date !== undefined) record.posting_date = dto.posting_date;

    // Rule 1: Validate gross ledger balancing parameters
    if (record.cash_pos + record.credit !== record.gross_sales) {
      throw new BadRequestException(
        `Bookkeeping Error: Cash/POS (₦${record.cash_pos}) + Credit (₦${record.credit}) does not equal Gross Sales (₦${record.gross_sales}).`
      );
    }

    // Rule 2: Automate 5% management remittance
    record.remittance_deduction = record.gross_sales * 0.05;

    // Rule 3: Process Expected Bank formula
    record.expected_bank = record.gross_sales - record.remittance_deduction - record.expenses + record.credit_paid;

    // Rule 4: Compute Bank Delta variance
    record.bank_delta = record.actual_banked - record.expected_bank;
    if (record.bank_delta !== 0) {
      record.had_mismatch = true;
    }

    return await this.salesRepository.save(record);
  }
}
