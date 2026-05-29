import { Controller, Post, Body, BadRequestException, Get, Put, Param } from '@nestjs/common';
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

  @Get('daily-sales/:id')
  async getDailySales(@Param('id') id: string) {
    return this.financeService.findOneDailySales(Number(id));
  }

  @Put('daily-sales/:id')
  async updateDailySales(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.financeService.updateDailySales(Number(id), body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
