import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('lane_rates')
export class LaneRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  origin: string;

  @Column({ nullable: false })
  destination: string;

  @Column({ nullable: true })
  band: string;

  @Column('numeric', { precision: 10, scale: 2, nullable: false })
  base_price: number;

  @Column('numeric', { precision: 10, scale: 2, nullable: false })
  addl_per_kg: number;

  @Column('numeric', { precision: 10, scale: 2, nullable: false })
  door_addon: number;

  @CreateDateColumn({ nullable: true })
  created_at: Date;
}
