import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { boardRole, BoardUserEntity } from './entities/board.user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardUserEntity)
    private readonly boardUserRepository: Repository<BoardUserEntity>
  ){}

  async createBoard(userId, createDto: CreateBoardDto){
    if(createDto.title.length > 10 || createDto.title == null){
      throw new BadRequestException("제목이 비어있거나 10글자 이상입니다");
    }

    let boardCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    while (await this.boardRepository.findOne({where: {boardCode}}) != null){
      boardCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const board = this.boardRepository.create({
      boardCode,
      title: createDto.title,
    })
    await this.boardRepository.save(board);

    const boardUser = this.boardUserRepository.create({
      user: { id: userId },
      board,
      role: boardRole.MASTER
    })
    await this.boardUserRepository.save(boardUser);

    return board;
  }
  async getBoards(userId: number) {
    const boardUsers = await this.boardUserRepository.find({
      where: { userId },
      relations: { board: true },
      select: {
        userId: true,
        boardCode: true,
        board: {
          boardCode: true,
          title: true,
          boardColor: true,
        },
      },
    });

    return boardUsers.map(({ board }) => ({
      boardCode: board.boardCode,
      title: board.title,
      boardColor: board.boardColor,
    }));
  }

  async updateBoard(user, boardCode, updateDto: UpdateBoardDto) {
    let board = await this.boardRepository.findOne({where: {boardCode}});
    const boardUser = await this.boardUserRepository.find({where: {boardCode, userId: user.id}});
    // if(!board) { throw new NotFoundException("해당 보드를 찾을 수 없습니다"); }
    
    console.log(board, boardUser);
    // board.boardColor = updateDto.boardColor;
    // board.title = updateDto.title;

    // await 
  }

  async deleteBoard(user, boardCode) {
    const isAdmin = user?.role === "ADMIN";

    const board = await this.boardRepository.findOne({ where: { boardCode } });
    if (!board) {
      throw new NotFoundException("보드를 찾지 못했습니다");
    }

    if (isAdmin) {
      await this.boardRepository.delete({ boardCode });
      return;
    }

    const boardUser = await this.boardUserRepository.findOne({ where: { boardCode, userId: user.id } });
    if (!boardUser) {
      throw new ForbiddenException("해당 보드에 속해있지 않습니다");
    }

    if (boardUser.role === boardRole.MASTER) {
      await this.boardRepository.delete({ boardCode });
      return;
    }

    await this.boardUserRepository.delete({ boardCode, userId: user.id });
  }

}