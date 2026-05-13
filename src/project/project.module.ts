import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { BoardUser } from 'src/board/entities/board.user.entity';
import { DayService } from 'src/day/day.service';
import { DayModule } from 'src/day/day.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, BoardUser]), DayModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
