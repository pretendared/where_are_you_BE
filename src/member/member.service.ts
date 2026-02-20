import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { boardRole, BoardUser } from 'src/board/entities/board.user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(BoardUser)
    private boardUserRepository: Repository<BoardUser>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>
  ){}

  async getMembers(boardCode: string) {
    const boardUsers = await this.boardUserRepository.find({where: {boardCode}, relations: {user: true}})
    if(!boardUsers) {throw new NotFoundException('해당 보드를 찾을 수 없습니다')}

    return boardUsers.map(bu => {return {id: bu.userId, nickname: bu.user.nickname, profileImage: bu.user.profileImage, role: bu.role}})
  }
  
  async updateMemberRole(boardCode: string, reqUser: {id:string, role:string}, targetId: string, newRole: boardRole){
    const reqMember = await this.boardUserRepository.findOne({where: {boardCode, userId: reqUser.id}, select: {role: true}})
    let targetMember = await this.boardUserRepository.findOne({where: {boardCode, userId: targetId}});

    if(!targetMember) {throw new NotFoundException("해당 보드 혹은 유저를 찾을 수 없습니다")}
    if(newRole != boardRole.MASTER && newRole != boardRole.MEMBER) {throw new BadRequestException("잘못된 변경값입니다")}
    if(!reqMember && reqUser.role != 'ADMIN' && reqMember.role != boardRole.MASTER) {throw new ForbiddenException("해당 유저를 수정할 권한이 없습니다");}
    if(!await this.boardUserRepository.find({where: {boardCode, role: boardRole.MASTER}})) {throw new BadRequestException("최소 한명 이상의 방장이 필요합니다")}

    targetMember.role = newRole;
    await this.boardUserRepository.save(targetMember);
    return this.getMembers(boardCode);
  }

  async kickMember(boardCode: string, reqUser: {id:string, role: string}, targetId: string){
    const board = await this.boardRepository.findOne({where: {boardCode}, relations: ['boardUser']});
    if(!board) {throw new NotFoundException('해당 보드를 찾을 수 없습니다')}

    const targetMember = board.boardUser.find(m => m.userId == targetId);
    const reqMember = board.boardUser.find(m => m.userId == reqUser.id);
    if(!targetMember || !reqMember) {throw new NotFoundException("해당 보드에 속해있지 않거나 멤버를 찾을 수 없습니다")}
    if(reqMember.role != boardRole.MASTER && reqUser.role != "ADMIN" && board.authorId == targetId) {throw new ForbiddenException('해당 멤버를 추방할 권한이 없습니다')}

    await this.boardUserRepository.delete({userId: targetId})
    return this.getMembers(boardCode);
  }
}
