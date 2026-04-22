import { Board } from "src/board/entities/board.entity";
import { Day } from "src/day/entityes/day.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  startedAt: Date;

  @Column()
  endedAt: Date;

  @Column()
  address: string;

  @Column()
  titleImage: string;

  @Column()
  boardCode: string;

  @ManyToOne(() => Board, board => board.projects, {onDelete: 'CASCADE'})
  @JoinColumn({ name: "boardCode"})
  board: Board;

  @OneToMany(() => Day, day => day.project)
  days: Day[];
}
