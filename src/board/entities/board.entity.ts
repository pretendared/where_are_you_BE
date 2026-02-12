import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BoardUserEntity } from "./board.user.entity";
import { Post } from "src/posts/entities/post.entity";


@Entity()
export class Board {
  @PrimaryColumn()
  boardCode: string;

  @Column()
  title: string;

  @Column({default: "#B9BBC6"})
  boardColor: string;
  
  @OneToMany(() => BoardUserEntity, (boardUser) => boardUser.board)
  boardUser: BoardUserEntity[];

  @OneToMany(() => Post, post => post.board)
  post: Post[];
}
