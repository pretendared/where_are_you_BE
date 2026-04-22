import { Project } from "src/project/entities/project.entity";
import { Task } from "src/task/entities/task.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayIndex: number;

  @ManyToOne(() => Project, project => project.days, {onDelete: 'CASCADE'})
  project: Project;

  @OneToMany(() => Task, task => task.day)
  tasks: Task[];
}