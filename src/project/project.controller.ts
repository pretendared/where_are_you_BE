import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';

@Controller(':boardCode/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtGuard)
  @Post('/create')
  create(@Req() req, @Param('boardCode') boardCode: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user, boardCode, createProjectDto);
  }

  @UseGuards(JwtGuard)
  @Get('/list')
  findAll(@Param('boardCode') boardCode: string) {
    return this.projectService.findAll(boardCode);
  }

  @UseGuards(JwtGuard)
  @Patch('update/:id')
  update(@Req() req, @Param('boardCode') boardCode: string, @Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(req.user, boardCode, id, updateProjectDto);
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  remove(@Param('id') projectId: number, @Req() req, @Param('boardCode') boardCode: string) {
    return this.projectService.remove(projectId, req.user, boardCode);
  }
}
