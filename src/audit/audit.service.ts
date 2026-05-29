import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async logAction(userId: number, action: string, table: string, id: number, oldValue: any, newValue: any, device?: string) {
    const log = this.auditRepository.create({
      user_id: userId,
      action,
      target_table: table,
      target_id: id,
      old_value: oldValue,
      new_value: newValue,
      device: device || 'System Agent',
    });
    return await this.auditRepository.save(log);
  }
}
