import { BoardUserEntity } from "src/board/entities/board.user.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

export enum UserProvider{
  google = 'google',
  kakao = "kakao",
  naver = 'naver',
  apple = "apple",
  email = 'email'
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column({ unique: true, default: null, nullable: true })
  nickname: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  profileImage: string | null;

  @Column({type: 'enum', enum: UserProvider, default: UserProvider.email})
  provider: string;

  @Column({default: null})
  role: string | null;

  @Column({default: false})
  isDeleted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => BoardUserEntity, (boardUser) => boardUser.user)
  boardUser: BoardUserEntity[];

  @ManyToOne(() => Post, post => post.author)
  post: Post[];
}
