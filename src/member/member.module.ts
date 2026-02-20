import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardUser } from 'src/board/entities/board.user.entity';
import { Board } from 'src/board/entities/board.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BoardUser, Board])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
