import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Board } from 'src/board/entities/board.entity';
import { BoardUserEntity } from 'src/board/entities/board.user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Board, BoardUserEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
