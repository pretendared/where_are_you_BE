import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { get } from 'http';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';
import { TaskCreateDto } from './dto/taskCreate.dto';

@Controller(':projectId/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard)
  @Post('/create/normal')
  createNormalTask(@Param('projectId') projectId: number, @Req() req, @Body() body: TaskCreateDto.Nomal) {
    return this.taskService.createNormalTask(projectId, req.user, body);
  }

  @UseGuards(JwtGuard)
  @Post('/create/map')
  createMapTask(@Param('projectId') projectId: number, @Param('dayIndex') dayIndex: number, @Req() req, @Body() body: TaskCreateDto.Map) {
    return this.taskService.createMapTask(projectId, req.user, body);
  }

  @UseGuards(JwtGuard)
  @Get('/list')
  getTasks(@Param('projectId') projectId: number) {
    return this.taskService.getTasks(projectId);
  }

  @UseGuards(JwtGuard)
  @Get('/:taskId')
  getTaskDetail(@Param('taskId') taskId: number) {
    return this.taskService.getTaskDetail(taskId);
  }

  @UseGuards(JwtGuard)
  @Patch('/:taskId')
  updateTask() {

  }

  @Delete('/:taskId')
  deleteTask() {

  }
}