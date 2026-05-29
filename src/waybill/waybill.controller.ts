import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WaybillService } from './waybill.service';

@Controller('waybill')
export class WaybillController {
  constructor(private waybillService: WaybillService) {}

  @Get('depots')
  async getDepots() {
    return this.waybillService.getDepots();
  }

  @Get('quote')
  async getQuote(
    @Query('originDepotId') originDepotId: number,
    @Query('destinationDepotId') destinationDepotId: number,
    @Query('weight') weight: number,
    @Query('isHomeDelivery') isHomeDelivery: string,
  ) {
    return this.waybillService.calculateQuote(
      Number(originDepotId),
      Number(destinationDepotId),
      Number(weight),
      isHomeDelivery === 'true',
    );
  }

  @Post()
  async createWaybill(@Body() body: any) {
    return this.waybillService.createWaybill(body);
  }

  @Get()
  async getWaybills() {
    return this.waybillService.getWaybills();
  }
}
