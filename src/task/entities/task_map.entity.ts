import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class TaskMap {
  @PrimaryColumn()
  taskId: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  placeId: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @OneToOne(() => Task, task => task.taskMap, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;
}