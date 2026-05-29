import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('waybills')
export class Waybill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  waybill_no: string;

  @Column()
  origin_depot_id: number;

  @Column()
  destination_depot_id: number;

  @Column()
  clerk_id: number;

  @Column()
  sender_name: string;

  @Column()
  sender_phone: string;

  @Column()
  receiver_name: string;

  @Column()
  receiver_phone: string;

  @Column({ nullable: true })
  receiver_address: string;

  @Column()
  item_description: string;

  @Column('numeric', { precision: 12, scale: 2 })
  declared_value: number;

  @Column('numeric', { precision: 8, scale: 2 })
  chargeable_weight: number;

  @Column({ default: false })
  is_fragile: boolean;

  @Column({ default: false })
  is_home_delivery: boolean;

  @Column('numeric', { precision: 10, scale: 2 })
  official_calculated_price: number;

  @Column('numeric', { precision: 10, scale: 2 })
  final_charged_price: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0.00 })
  discount_applied: number;

  @Column({ default: true })
  is_discount_approved: boolean;

  @Column({ default: 'Registered' })
  status: string;

  @Column({ default: 'Unpaid' })
  payment: string;

  @CreateDateColumn()
  created_at: Date;
}
