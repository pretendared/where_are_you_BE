import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BoardUserEntity } from "./board.user.entity";

@Entity()
export class Board {
  @PrimaryColumn()
  boardCode: string;

  @Column()
  title: string;

  @Column({default: "gray"})
  boardColor: string;
  
  @OneToMany(() => BoardUserEntity, (boardUser) => boardUser.board)
  boardUser: BoardUserEntity[];
}
