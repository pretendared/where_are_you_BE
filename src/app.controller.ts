import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { BoardService } from './board/board.service';
import { JwtGuard } from './auth/gurad/jwt.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

}
