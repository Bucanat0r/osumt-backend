import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('waybills')
export class Waybill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  waybill_no: string;

  @Column({ nullable: true })
  origin_depot_id: number;

  @Column({ nullable: true })
  destination_depot_id: number;

  @Column({ nullable: true })
  clerk_id: number;

  @Column({ nullable: false })
  sender_name: string;

  @Column({ nullable: false })
  sender_phone: string;

  @Column({ nullable: false })
  receiver_name: string;

  @Column({ nullable: false })
  receiver_phone: string;

  @Column({ nullable: true })
  receiver_address: string;

  @Column({ nullable: false })
  item_description: string;

  @Column('numeric', { precision: 12, scale: 2, nullable: false })
  declared_value: number;

  @Column('numeric', { precision: 8, scale: 2, nullable: false })
  chargeable_weight: number;

  @Column({ default: false, nullable: true })
  is_fragile: boolean;

  @Column({ default: false, nullable: true })
  is_home_delivery: boolean;

  @Column('numeric', { precision: 10, scale: 2, nullable: false })
  official_calculated_price: number;

  @Column('numeric', { precision: 10, scale: 2, nullable: false })
  final_charged_price: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0.00, nullable: true })
  discount_applied: number;

  @Column({ default: true, nullable: true })
  is_discount_approved: boolean;

  @Column({ default: 'Registered', nullable: true })
  status: string;

  @Column({ default: 'Unpaid', nullable: true })
  payment: string;

  @CreateDateColumn({ nullable: true })
  created_at: Date;
}
