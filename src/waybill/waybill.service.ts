import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Depot } from './depot.entity';
import { LaneRate } from './lane-rate.entity';
import { Waybill } from './waybill.entity';

@Injectable()
export class WaybillService implements OnModuleInit {
  constructor(
    @InjectRepository(Waybill)
    private waybillRepository: Repository<Waybill>,
    @InjectRepository(Depot)
    private depotRepository: Repository<Depot>,
    @InjectRepository(LaneRate)
    private laneRateRepository: Repository<LaneRate>,
  ) {}

  async onModuleInit() {
    // 1. Seed depots if empty
    const depotCount = await this.depotRepository.count();
    if (depotCount === 0) {
      const lagos = this.depotRepository.create({
        depot_name: 'Lagos Central',
        region: 'South-West',
        active_status: true,
      });
      const abuja = this.depotRepository.create({
        depot_name: 'Abuja Main',
        region: 'North-Central',
        active_status: true,
      });
      await this.depotRepository.save([lagos, abuja]);
      console.log('Default depots seeded successfully (Lagos Central, Abuja Main)');
    }

    // 2. Seed lane rates if empty
    const laneRateCount = await this.laneRateRepository.count();
    if (laneRateCount === 0) {
      const route = this.laneRateRepository.create({
        origin: 'Lagos Central',
        destination: 'Abuja Main',
        band: 'A',
        base_price: 5000.00,
        addl_per_kg: 450.00,
        door_addon: 2500.00,
      });
      await this.laneRateRepository.save(route);
      console.log('Default lane rates seeded successfully (Lagos Central -> Abuja Main)');
    }
  }

  async calculateQuote(
    originDepotId: number,
    destinationDepotId: number,
    weight: number,
    isHomeDelivery: boolean,
  ) {
    const originDepot = await this.depotRepository.findOne({ where: { id: originDepotId } });
    const destDepot = await this.depotRepository.findOne({ where: { id: destinationDepotId } });

    if (!originDepot || !destDepot) {
      throw new NotFoundException('Origin or destination depot not found');
    }

    // Find the lane rate matching the origin and destination depot names
    const laneRate = await this.laneRateRepository.findOne({
      where: { origin: originDepot.depot_name, destination: destDepot.depot_name },
    });

    if (!laneRate) {
      throw new NotFoundException(`No pricing rate found for lane: ${originDepot.depot_name} to ${destDepot.depot_name}`);
    }

    const basePrice = Number(laneRate.base_price);
    const addlPerKg = Number(laneRate.addl_per_kg);
    const doorAddon = Number(laneRate.door_addon);

    // Calculate official price: base price (covers up to 5kg) + extra weight * rate per kg
    let officialPrice = basePrice;
    if (weight > 5) {
      officialPrice += (weight - 5) * addlPerKg;
    }

    // Add door delivery fee if applicable
    if (isHomeDelivery) {
      officialPrice += doorAddon;
    }

    return {
      officialPrice,
      basePrice,
      addlPerKg,
      doorAddon,
    };
  }

  async createWaybill(dto: any) {
    const quote = await this.calculateQuote(
      dto.origin_depot_id,
      dto.destination_depot_id,
      dto.chargeable_weight,
      dto.is_home_delivery,
    );

    const officialPrice = quote.officialPrice;
    const finalChargedPrice = Number(dto.final_charged_price);
    const discountApplied = officialPrice - finalChargedPrice;

    // If final charged price is lower than the official rate, flag as unapproved
    const isDiscountApproved = discountApplied <= 0;

    const waybillNo = `WYB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const waybill = this.waybillRepository.create({
      ...dto,
      waybill_no: waybillNo,
      official_calculated_price: officialPrice,
      final_charged_price: finalChargedPrice,
      discount_applied: discountApplied > 0 ? discountApplied : 0.00,
      is_discount_approved: isDiscountApproved,
      status: 'Registered',
      payment: dto.payment || 'Unpaid',
    });

    return this.waybillRepository.save(waybill);
  }

  async getWaybills() {
    return this.waybillRepository.find({ order: { created_at: 'DESC' } });
  }

  async getDepots() {
    return this.depotRepository.find({ where: { active_status: true } });
  }
}
