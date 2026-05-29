import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('depots')
export class Depot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  depot_name: string;

  @Column({ nullable: true })
  region: string;

  @Column({ default: true, nullable: true })
  active_status: boolean;

  @CreateDateColumn({ nullable: true })
  created_at: Date;
}
