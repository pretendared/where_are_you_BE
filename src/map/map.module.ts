import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapGateway } from './map.gateway';

@Module({
  providers: [MapGateway, MapService],
})
export class MapModule {}
