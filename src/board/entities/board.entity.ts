import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { BoardUser } from "./board.user.entity";
import { Post } from "src/posts/entities/post.entity";
import { Project } from "src/project/entities/project.entity";


@Entity()
export class Board {
  @PrimaryColumn()
  boardCode: string;

  @Column()
  title: string;

  @Column()
  authorId: string;

  @Column({default: "#B9BBC6"})
  boardColor: string;
  
  @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
  boardUser: BoardUser[];

  @OneToMany(() => Post, post => post.board)
  post: Post[];

  @OneToMany(() => Project, project => project.board)
  projects: Project[];
}
