import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'varchar',
    default: 'Revenue Clerk', // Fallback default role
  })
  role: string; // Roles: Super Admin / CEO, Operations Admin, Finance Admin, Depot Manager, Revenue Clerk, Waybill Clerk, Driver/Dispatch

  @Column({ nullable: true })
  depot_id: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
