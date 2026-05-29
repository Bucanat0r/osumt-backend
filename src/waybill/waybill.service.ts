import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Waybill } from './waybill.entity';

@Injectable()
export class WaybillService {
  constructor(
    @InjectRepository(Waybill)
    private waybillRepository: Repository<Waybill>,
    // We will inject a LaneRates repository to pull live official parameters
  ) {}

  /**
   * Calculates the official shipping quote based on route configurations
   */
  async calculateQuote(payload: {
    origin: string;
    destination: string;
    weight: number;
    isFragile: boolean;
    isHomeDelivery: boolean;
  }) {
    const { weight, isFragile, isHomeDelivery } = payload;

    if (weight <= 0) {
      throw new BadRequestException('Chargeable weight must be greater than 0 kg');
    }

    // In a full implementation, you would query your lane_rates table. 
    // For this prototype vertical slice, we mock the DB lookup for 'Lagos Central' -> 'Abuja Main'
    const basePrice = 5000.00;   // Base rate covers 0-5kg
    const addlPerKg = 450.00;    // Cost per KG after 5kg
    const doorAddon = 2500.00;   // Flat fee for home delivery
    const fragileFee = payload.isFragile ? 1500.00 : 0.00;

    // Apply the core business logic formula: Base + max(0, KG - 5) * Addl_per_kg
    const extraWeight = Math.max(0, weight - 5);
    const officialBaseAndWeightPrice = basePrice + (extraWeight * addlPerKg);
    
    const totalAddons = (isHomeDelivery ? doorAddon : 0) + fragileFee;
    const officialCalculatedPrice = officialBaseAndWeightPrice + totalAddons;

    return {
      basePrice,
      extraWeight,
      weightCharge: extraWeight * addlPerKg,
      doorAddon: isHomeDelivery ? doorAddon : 0,
      fragileFee,
      officialCalculatedPrice,
    };
  }

  /**
   * Registers a brand-new waybill inside the database with compliance auditing
   */
  async createWaybill(clerkId: number, data: any) {
    // Generate an official sequential or unique tracked Waybill number
    const uniqueId = Math.floor(100000 + Math.random() * 900000);
    const waybillNo = `OSUMT-${Date.now().toString().slice(-4)}-${uniqueId}`;

    // Get the system calculated rate
    const quote = await this.calculateQuote({
      origin: data.origin,
      destination: data.destination,
      weight: Number(data.chargeable_weight),
      isFragile: data.is_fragile,
      isHomeDelivery: data.is_home_delivery,
    });

    const officialPrice = quote.officialCalculatedPrice;
    const finalPrice = Number(data.final_charged_price);
    const discount = Math.max(0, officialPrice - finalPrice);
    
    // Core Audit Flag: If the final charged price is less than official rate, mark it unapproved
    const isDiscountApproved = finalPrice >= officialPrice;

    const newWaybill = this.waybillRepository.create({
      waybill_no: waybillNo,
      clerk_id: clerkId,
      origin_depot_id: data.origin_depot_id || 1,
      destination_depot_id: data.destination_depot_id || 2,
      sender_name: data.sender_name,
      sender_phone: data.sender_phone,
      receiver_name: data.receiver_name,
      receiver_phone: data.receiver_phone,
      receiver_address: data.receiver_address,
      item_description: data.item_description,
      declared_value: data.declared_value,
      chargeable_weight: data.chargeable_weight,
      is_fragile: data.is_fragile,
      is_home_delivery: data.is_home_delivery,
      official_calculated_price: officialPrice,
      final_charged_price: finalPrice,
      discount_applied: discount,
      is_discount_approved: isDiscountApproved,
      status: 'Registered',
      payment: data.payment || 'Unpaid',
    });

    return await this.waybillRepository.save(newWaybill);
  }
}
