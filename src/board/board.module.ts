import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardUserEntity } from './entities/board.user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardUserEntity]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService]
})
export class BoardModule {}
