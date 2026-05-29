import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('daily-sales')
  async submitDailySales(@Body() body: any) {
    try {
      const mockClerkId = 1; // Prototype user baseline
      return await this.financeService.postDailySales(mockClerkId, body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
