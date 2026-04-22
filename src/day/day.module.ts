import { Module } from '@nestjs/common';
import { DayService } from './day.service';
import { DayController } from './day.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Day } from './entityes/day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Day, Project])],
  controllers: [DayController],
  providers: [DayService],
  exports: [DayService],
})
export class DayModule {}
