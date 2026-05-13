import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskType } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskMap } from './entities/task_map.entity';
import { TaskCreateDto } from './dto/taskCreate.dto';
import { Day } from 'src/day/entityes/day.entity';
import { Project } from 'src/project/entities/project.entity';
import { time } from 'console';
import { start } from 'repl';

@Injectable()
export class TaskService {
  constructor(

    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(TaskMap)
    private taskMapRepository: Repository<TaskMap>,

    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
  ) {}
  
  async createMapTask(projectId: number, user: {id: string, role: string}, body: TaskCreateDto.Map) {
    if(!body) {throw new BadRequestException("잘못된 요청입니다.")}

    const day = await this.dayRepository.findOne({ where: { projectId, dayIndex: body.dayIndex } });
    if(!day) {throw new NotFoundException("존재하지 않는 날짜입니다.")}

    const task = this.taskRepository.create({
      title: body.title,
      description: body.description,
      startedTime: body.startedTime,
      endedTime: body.endedTime,
      type: TaskType.PLACEMENT,
      day,
    });
    await this.taskRepository.save(task);

    const taskMap = this.taskRepository.manager.getRepository(TaskMap).create({
      taskId: task.id,
      name: body.geometry.name,
      address: body.geometry.address,
      lat: body.geometry.lat,
      lng: body.geometry.lng,
      placeId: body.geometry.placeId
    });
    await this.taskMapRepository.save(taskMap);
    // return this.getTasks(projectId);
    return {
      date: day.date,
      time: {
        start: task.startedTime,
        end: task.endedTime,
      }
    }
  }

  async createNormalTask(projectId: number, user: {id: string, role: string}, body: TaskCreateDto.Nomal) {
    if(!body) {throw new BadRequestException("잘못된 요청입니다.")}

    const day = await this.dayRepository.findOne({ where: { projectId, dayIndex: body.dayIndex } });
    if(!day) {throw new NotFoundException("존재하지 않는 날짜입니다.")}

    const task = this.taskRepository.create({
      title: body.title,
      content: body.content,
      description: body.description,
      startedTime: body.startedTime,
      endedTime: body.endedTime,
      type: TaskType.NORMAL,
      day,
    });
    await this.taskRepository.save(task);
    // return this.getTasks(projectId);
    return {
      date: day.date,
      time: {
        start: task.startedTime,
        end: task.endedTime,
      }
    }
  }

  async getTasks(projectId: number) {
    const days = await this.dayRepository.find({ where: { projectId }, relations: ['tasks', 'tasks.taskMap'], order: { dayIndex: 'ASC', tasks: { startedTime: 'ASC' } } });
    return days.map((day) => ({
      dayIndex: day.dayIndex,
      memo: day.memo,
      date: day.date,
      tasks: day.tasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          time: {
            start: task.startedTime,
            end: task.endedTime,
          },
          type: task.type,
          location: task.taskMap ? {
            address: task.taskMap.address,
            placeId: task.taskMap.placeId,
            lat: task.taskMap.lat,
            lng: task.taskMap.lng,
          } : null,
        };
      }),
    }));
}

  async getTaskDetail(taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['day', 'taskMap'] });
    if (!task) {
      throw new NotFoundException("존재하지 않는 일정입니다.");
    }

    if(task.type === TaskType.PLACEMENT) {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        time: {
          start: task.startedTime,
          end: task.endedTime,
        },
        type: task.type,
        location: {
          address: task.taskMap.address,
          placeId: task.taskMap.placeId,
          lat: task.taskMap.lat,
          lng: task.taskMap.lng,
        }
      };
    }
    else {
      return {
        id: task.id,
        title: task.title,
        content: task.content,
        description: task.description,
        time: {
          start: task.startedTime,
          end: task.endedTime,
        },
        type: task.type,
      }
    }
  }
}