import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Day } from './entityes/day.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async createDate(projectId: number, sDate: Date, eDate: Date) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if(!project) {throw new NotFoundException("존재하지 않는 프로젝트입니다.")}
  
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let dayIndex = 1;
    const days = [];
    for(let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(this.dayRepository.create({
        dayIndex: dayIndex++,
        date: new Date(date),
        projectId: projectId
      }));
    }

    await this.dayRepository.save(days);
  }

  async getDays(projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if(!project) {throw new NotFoundException("존재하지 않는 프로젝트입니다.")}

    return this.dayRepository.find({ where: { projectId }, relations: ['tasks'] });
  }

  async updateMemo(projectId: number, dayIndex: number, memo: string) {
    const day = await this.dayRepository.findOne({ where: { projectId, dayIndex } });
    if(!day) {throw new NotFoundException("존재하지 않는 날짜입니다.")}

    day.memo = memo;
    await this.dayRepository.save(day);
  }
}
