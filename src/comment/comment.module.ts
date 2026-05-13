import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { BoardUser } from 'src/board/entities/board.user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, BoardUser])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
