import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column()
  action: string;

  @Column()
  target_table: string;

  @Column()
  target_id: number;

  @Column('jsonb', { nullable: true })
  old_value: any;

  @Column('jsonb')
  new_value: any;

  @Column({ nullable: true })
  device: string;

  @CreateDateColumn()
  timestamp: Date;
}
