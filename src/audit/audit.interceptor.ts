import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;
    const device = headers['user-agent'] || 'System Agent';
    const userId = request.user?.id || 1;

    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return next.handle().pipe(
      tap(async (data) => {
        if (!isWrite || !data) return;

        // Skip non-modifying operations and authentication endpoints
        if (
          url.includes('/quote') ||
          url.includes('/login') ||
          url.includes('/dashboard')
        ) {
          return;
        }

        let action = '';
        let targetTable = '';
        const targetId = data.id || 0;
        const oldValue = null;
        const newValue = data;

        if (url.includes('/waybills')) {
          action = method === 'POST' ? 'CREATE_WAYBILL' : 'UPDATE_WAYBILL';
          targetTable = 'waybills';
        } else if (url.includes('/finance/daily-sales')) {
          action = method === 'POST' ? 'CLOSE_DAY' : 'UPDATE_DAILY_SALES';
          targetTable = 'daily_sales';
        } else {
          action = `${method}_RECORD`;
          targetTable = url.split('/')[1] || 'unknown';
        }

        try {
          await this.auditService.logAction(
            userId,
            action,
            targetTable,
            targetId,
            oldValue,
            newValue,
            device,
          );
        } catch (error) {
          console.error('Failed to write audit log:', error);
        }
      }),
    );
  }
}
