import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { In, Repository } from 'typeorm';
import { boardRole, BoardUser } from './entities/board.user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>
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

  async joinBoard(userId: string, boardCode: string){
    const board = await this.boardRepository.findOne({where: {boardCode}})
    if(!board) {throw new NotFoundException("해당 보드를 찾을 수 없습니다")}

    const boardUser = await this.boardUserRepository.findOne({where: {userId, boardCode}});
    if(boardUser) {throw new ConflictException("이미 가입한 보드입니다")}
    
    this.boardUserRepository.save({userId, boardCode, role: boardRole.MEMBER})
    
    return {message: "가입 성공"}
  }
    async generateNewCode(user: {id: string, role: string}, boardCode: string){
      const boardUser = await this.boardUserRepository.findOne({where: {userId: user.id, boardCode}})
      if(user.role != "ADMIN" && boardUser.role != boardRole.MASTER) {throw new ForbiddenException("보드 코드를 재설정할 권한이 없습니다");}
      const board = await this.boardRepository.findOne({where: {boardCode}});
      const boardUsers = await this.boardUserRepository.find({where: {boardCode}})
      
      if(!board) {throw new NotFoundException("해당 보드를 찾을 수 없습니다")}
  
      let newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      while (await this.boardRepository.findOne({where: {boardCode: newCode}}) != null){
        newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      }
  
      board.boardCode = newCode;
      boardUsers.forEach(bu => {
        bu.boardCode = newCode;
      });
  
      return {newCode};
    }
  
  async getBoards(userId: string) {
    const boardUsers = await this.boardUserRepository.find({
      where: {userId},
      relations: { board: true },
    });

    if (boardUsers.length === 0) {
      return [];
    }

    const boardCodes = boardUsers.map(bu => bu.boardCode);
    const masters = await this.boardUserRepository.find({
      where: { boardCode: In(boardCodes), role: boardRole.MASTER },
      relations: { user: true },
    });

    const masterByBoard = new Map(masters.map(master => [master.boardCode, master.user]));

    return boardUsers.map(bu => {
      const master = masterByBoard.get(bu.boardCode);
      return {
        boardCode: bu.board.boardCode,
        title: bu.board.title,
        boardColor: bu.board.boardColor,
        author: {
          id: master.id,
          nickname: master.nickname,
          profileImage: master.profileImage
        }
      };
    });
  }

  async updateBoard(user, boardCode, updateDto: UpdateBoardDto) {
    let board = await this.boardRepository.findOne({where: {boardCode}});
    const boardUser = await this.boardUserRepository.findOne({where: {boardCode, userId: user.id}});
    if(!board) {throw new NotFoundException("해당 보드를 찾을 수 없습니다")}
    if(!boardUser) {throw new ForbiddenException("해당 보드에 속해있지 않습니다")}
    if(user.role != "ADMIN" && boardUser.role != boardRole.MASTER) {throw new ForbiddenException("해당 보드를 수정할 권한이 없습니다")}

    if(updateDto.title) {board.title = updateDto.title}
    if(updateDto.boardColor) {board.boardColor = updateDto.boardColor}

    return this.boardRepository.save(board);
  }

  async deleteBoard(user, boardCode) {
    const userId = user.id;

    return this.boardRepository.manager.transaction(async (manager) => {
      const boardRepo = manager.getRepository(Board);
      const boardUserRepo = manager.getRepository(BoardUser);

      const board = await boardRepo.findOne({ where: { boardCode } });
      if (!board) {
        throw new NotFoundException("해당 보드를 찾을 수 없습니다");
      }

      if (user.role == "ADMIN") {
        await boardRepo.delete({ boardCode });
        return;
      }

      const boardUser = await boardUserRepo.findOne({ where: { boardCode, userId } });
      if (!boardUser) {
        throw new ForbiddenException("해당 보드에 속해있지 않습니다");
      }

      if (user.role == "ADMIN" || boardUser.role === boardRole.MASTER) {
        await boardRepo.delete({ boardCode });
        return {
          message: "성공적으로 보드를 제거했습니다"
        };
      }

      await boardUserRepo.delete({ boardCode, userId });
      return {
        message: "성공적으로 보드를 탈퇴하였습니다"
      }
    });
    });
  }


}