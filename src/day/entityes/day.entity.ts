import { Project } from "src/project/entities/project.entity";
import { Task } from "src/task/entities/task.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Day {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dayIndex: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({nullable: true, default: null})
  memo: string;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, project => project.days, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => Task, task => task.day)
  tasks: Task[];
}