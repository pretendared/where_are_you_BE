import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,CreateDateColumn,UpdateDateColumn,JoinColumn} from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Board } from 'src/board/entities/board.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boardCode: string;

  @Column()
  authorId: string;

  @Column({length: 50})
  title: string;

  @Column({length: 500})
  content: string;

  @ManyToOne(() => Board, board => board.post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardCode' })
  board: Board;

  @ManyToOne(() => User, user => user.post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
