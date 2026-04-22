import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TaskMap } from "./task_map.entity";
import { Day } from "src/day/entityes/day.entity";

export enum TaskType {
  NORMAL = 'NORMAL',
  PLACEMENT = 'PLACEMENT',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, default: '' })
  content: string;

  @Column()
  description: string;

  @Column()
  startedTime: string;

  @Column()
  endedTime: string;

  @Column({type: 'enum', enum: TaskType})
  type: TaskType;

  @ManyToOne(() => Day, day => day.tasks, {onDelete: 'CASCADE'})
  day: Day;

  @Column({ nullable: true })
  @OneToOne(() => TaskMap, TaskMap => TaskMap.task, {nullable: true, cascade: true})
  taskMap: TaskMap;
}
