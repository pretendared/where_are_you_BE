import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';

@Controller('/project')
@UseGuards(JwtGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post('/create/:boardCode')
  create(@Req() req, @Param('boardCode') boardCode: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user, boardCode, createProjectDto);
  }

  @Get('/list/:boardCode')
  findAll(@Param('boardCode') boardCode: string) {
    return this.projectService.findAll(boardCode);
  }

  @Patch('update/:boardCode/:id')
  update(@Req() req, @Param('boardCode') boardCode: string, @Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(req.user, boardCode, id, updateProjectDto);
  }

  @Delete('delete/:boardCode/:id')
  remove(@Param('id') projectId: number, @Req() req, @Param('boardCode') boardCode: string) {
    return this.projectService.remove(projectId, req.user, boardCode);
  }
}
