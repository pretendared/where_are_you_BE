import { WebSocketGateway } from '@nestjs/websockets';
import { MapService } from './map.service';

@WebSocketGateway()
export class MapGateway {
  constructor(private readonly mapService: MapService) {}
}
