import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('daily_sales')
export class DailySales {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  depot_id: number;

  @Column({ nullable: false })
  clerk_id: number;

  @Column({ type: 'date', unique: true, nullable: true })
  posting_date: string;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  cash_pos: number;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  credit: number;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  gross_sales: number;

  @Column('numeric', { precision: 12, scale: 2, default: 0, nullable: true })
  expenses: number;

  @Column('numeric', { precision: 12, scale: 2, default: 0, nullable: true })
  credit_paid: number;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  remittance_deduction: number;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  expected_bank: number;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  actual_banked: number;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  bank_delta: number;

  @Column({ nullable: false })
  bank_proof_url: string;

  @Column({ default: false, nullable: true })
  is_locked: boolean;

  @Column({ default: false, nullable: true })
  had_mismatch: boolean;

  @CreateDateColumn({ nullable: true })
  created_at: Date;
}
