import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('depots')
export class Depot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  depot_name: string;

  @Column()
  region: string;

  @Column({ default: true })
  active_status: boolean;

  @CreateDateColumn()
  created_at: Date;
}
