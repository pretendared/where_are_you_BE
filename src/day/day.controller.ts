import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DayService } from './day.service';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';

@Controller(':projectId')
@UseGuards(JwtGuard)
export class DayController {
  constructor(private readonly dayService: DayService) { }

  @Patch('/memo')
  async updateMemo(@Param('projectId') projectId: number, @Body('dayIndex') dayIndex: number, @Body('memo') memo: string) {
    await this.dayService.updateMemo(projectId, dayIndex, memo);
  }

  @Get('/days')
  async getDays(@Param('projectId') projectId: number) {
    return this.dayService.getDays(projectId);
  }
}