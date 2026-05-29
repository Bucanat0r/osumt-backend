import { Test, TestingModule } from '@nestjs/testing';
import { WaybillController } from './waybill.controller';

describe('WaybillController', () => {
  let controller: WaybillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaybillController],
    }).compile();

    controller = module.get<WaybillController>(WaybillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
