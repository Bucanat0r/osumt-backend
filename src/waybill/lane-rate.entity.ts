import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('lane_rates')
export class LaneRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column()
  band: string;

  @Column('numeric', { precision: 10, scale: 2 })
  base_price: number;

  @Column('numeric', { precision: 10, scale: 2 })
  addl_per_kg: number;

  @Column('numeric', { precision: 10, scale: 2 })
  door_addon: number;

  @CreateDateColumn()
  created_at: Date;
}
