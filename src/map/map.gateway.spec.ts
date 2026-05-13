import { Test, TestingModule } from '@nestjs/testing';
import { MapGateway } from './map.gateway';
import { MapService } from './map.service';

describe('MapGateway', () => {
  let gateway: MapGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapGateway, MapService],
    }).compile();

    gateway = module.get<MapGateway>(MapGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
