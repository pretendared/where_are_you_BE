import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';
import { get } from 'http';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  async createBoard(@Req() req, @Body() createBoardDto: CreateBoardDto) {
    // console.log(`${req.user.userId}님이 보드를 생성하였습니다`)
    return this.boardService.createBoard(req.user.userId, createBoardDto)
  }

  @UseGuards(JwtGuard)
  @Post('update/{boardCode}')
  async updateBoard(@Req() req, @Param("boardCode") boardCode, @Body() updateBoardDto: UpdateBoardDto){
    // console.log(`${req.user.userId}님이 ${boardCode} 보드를 수정하였습니다`)
    return this.boardService.updateBoard(req.user.role, boardCode, updateBoardDto)
  }

  @UseGuards(JwtGuard)
  @Get()
  async getBoards(@Req() req) {
    return this.boardService.getBoards(req.user.userId)
  }
}