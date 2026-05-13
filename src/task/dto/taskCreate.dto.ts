import { IsString } from "class-validator";
import { TaskType } from "../entities/task.entity";

export namespace TaskCreateDto {
  export class Nomal{
    title: string;
    dayIndex: number;
    startedTime: string
    endedTime: string;
    content: string;
    description: string; //특이사항
  }

  export class Map {
    dayIndex: number;
    title: string;
    description: string; //특이사항
    startedTime: string;
    endedTime: string;
    geometry: {
      name: string;
      address: string;
      placeId: string;
      lat: number;
      lng: number;
    }
  }
}
