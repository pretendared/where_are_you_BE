import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { boardRole, BoardUser } from 'src/board/entities/board.user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>
  ) {}


  async create(user: {id: string, role: string}, boardCode: string, createProjectDto: CreateProjectDto) {
    if(!createProjectDto) {throw new BadRequestException("잘못된 입력값입니다")}
    const boardUser = await this.boardUserRepository.findOne({ where: { boardCode, userId: user.id } });
    if(user.role !== 'admin' && boardUser.role != boardRole.MASTER) {throw new ForbiddenException("프로젝트를 생성할 권한이 없습니다.")}
    if(createProjectDto.startedAt > createProjectDto.endedAt) {throw new BadRequestException("프로젝트의 시작 날짜는 종료 날짜보다 늦을 수 없습니다.")}

    const project = this.projectRepository.create({
      ...createProjectDto,
      boardCode: boardCode
    })
    await this.projectRepository.save(project);
    return this.findAll(boardCode);
  }

  async findAll(boardCode: string) {
    const projects = await this.projectRepository.find({ where: { boardCode } });
    return projects.map(porject => {
      return {
        porjectId: porject.id,
        title: porject.title,
        endedAt: porject.endedAt,
        address: porject.address,
        titleImage: porject.titleImage,
      }
    });
  }

  async update(req: {id: string, role: string}, boardCode: string, projectId: number, updateProjectDto: UpdateProjectDto) {
    if(!updateProjectDto ) {throw new BadRequestException("잘못된 입력값입니다")}
    const boardUser = await this.boardUserRepository.findOne({ where: { boardCode: boardCode, userId: req.id } });
    if(!boardUser) {throw new ForbiddenException("해당 보드에 속해있지 않습니다.")}
    if(req.role !== 'admin' && boardUser.role != boardRole.MASTER) {throw new ForbiddenException("프로젝트를 수정할 권한이 없습니다.")}
    if(updateProjectDto.startedAt > updateProjectDto.endedAt) {throw new BadRequestException("프로젝트의 시작 날짜는 종료 날짜보다 늦을 수 없습니다.")}

    const project = await this.projectRepository.preload({
      id: projectId,
      boardCode,
      ...updateProjectDto,
    });

    await this.projectRepository.save(project);
    return this.findAll(boardCode);
  }

  async remove(id: number, req: {id: string, role: string}, boardCode: string) {
    const boardUser = await this.boardUserRepository.findOne({ where: { boardCode: boardCode, userId: req.id } });
    if(req.role !== 'admin' && boardUser.role != boardRole.MASTER) {throw new ForbiddenException("프로젝트를 삭제할 권한이 없습니다.")}

    const project = await this.projectRepository.findOne({ where: { id, boardCode } });
    if(!project) {throw new BadRequestException("존재하지 않는 프로젝트입니다.")}

    await this.projectRepository.remove(project);
    return this.findAll(boardCode);
  }
}
