import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { BoardUser } from 'src/board/entities/board.user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, BoardUser])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
