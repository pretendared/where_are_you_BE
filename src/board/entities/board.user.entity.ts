
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Board } from "./board.entity";
import { User } from "src/auth/entities/auth.entity";
export enum boardRole {
  MASTER = "MASTER",
  MEMBER = "MEMBER"
}

@Entity()
export class BoardUserEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  boardCode: string;

  @ManyToOne(() => User, user => user.boardUser, {onDelete: 'CASCADE'})
  @JoinColumn({name: "userId"})
  user: User;

  @ManyToOne(() => Board, board => board.boardUser, {onDelete: "CASCADE"})
  @JoinColumn({name: "boardCode"})
  board: Board;

  @Column({type: "enum", enum: boardRole, default: boardRole.MEMBER})
  role: boardRole;
}