import { Controller, Post, Body, Req, UseGuards, Get, Put, Param } from '@nestjs/common';
import { WaybillService } from './waybill.service';

@Controller('waybills')
export class WaybillController {
  constructor(private readonly waybillService: WaybillService) {}

  // 1. Endpoint to instantly fetch calculated quotes on keystroke/toggle
  @Post('quote')
  async getQuote(
    @Body() payload: {
      origin: string;
      destination: string;
      weight: number;
      isFragile: boolean;
      isHomeDelivery: boolean;
    },
  ) {
    return this.waybillService.calculateQuote(payload);
  }

  // 2. Endpoint to save the complete shipment transaction
  @Post()
  async registerWaybill(@Body() body: any) {
    // For prototype testing, passing mock clerk ID 1. 
    // In production, this maps to req.user.id from your JWT state.
    const mockClerkId = 1; 
    return this.waybillService.createWaybill(mockClerkId, body);
  }

  @Get(':id')
  async getWaybill(@Param('id') id: string) {
    return this.waybillService.findOneWaybill(Number(id));
  }

  @Put(':id')
  async updateWaybill(@Param('id') id: string, @Body() body: any) {
    return this.waybillService.updateWaybill(Number(id), body);
  }
}
