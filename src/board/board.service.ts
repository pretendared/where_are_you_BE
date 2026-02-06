import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { In, Repository } from 'typeorm';
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

  async getBoards(userId: number){  
    const boardCodes = (await this.boardUserRepository.find({where: {userId}, select: ["boardCode"]})).map(bc => bc.boardCode);
    const boards = await this.boardRepository.find({where: {boardCode: In(boardCodes)}})
    console.log(boards)
    return boards
  }

  async updateBoard(userRole, BoardCode, UpdateDto: UpdateBoardDto) {

  }
}