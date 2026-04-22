import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskMap } from './entities/task_map.entity';
import { Day } from 'src/day/entityes/day.entity';
import { Project } from 'src/project/entities/project.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Day, Task, TaskMap, Project])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
