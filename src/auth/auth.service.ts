import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserProvider } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { userUpdateDto } from './dto/update.dto';
config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
    private jwtService: JwtService,
  ) {}

  async Login(userDto: {userId: string, email: string, name: {familyName: string, givenName: string}, provider: UserProvider}) {
    let user = await this.userRepository.findOne({ where: { id: userDto.userId } });
    
    if (!user || user.isDeleted) {
      const longName = userDto.name.familyName + userDto.name.givenName;
      user = this.userRepository.create({
        id: userDto.userId,
        email: userDto.email,
        name: longName,
        provider: userDto.provider
      });
      await this.userRepository.save(user);
    }

    if(!user.nickname){
      return {
        statusCode: 201,
        needNickname: true,
        accsessToken: this.jwtService.sign({ sub: user.id }, { secret: process.env.JWT_ACCSESS_SECRET, expiresIn: '30m' }),
      }
    }
    const accsessToken = this.jwtService.sign({ sub: user.id, role: user.role, nickname: user.nickname }, { secret: process.env.JWT_ACCSESS_SECRET, expiresIn: '30m' });
    const refreshToken = this.jwtService.sign({ sub: user.id }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

    await this.redis.set(`refreshToken:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7일
    return { 
      statusCode: 200,
      accsessToken,
      refreshToken 
    };
  }

  async update(reqester, targetId: string, updateDto: userUpdateDto){
    if(reqester.role != "ADMIN" && reqester.id != targetId) {throw new ForbiddenException("해당 유저를 수정할 권한이 없습니다")}

    const user = await this.userRepository.findOne({ where: { id: targetId } });


    //닉네임 설정
    if(updateDto.nickname) {
      if(updateDto.nickname == '노무현') { throw new HttpException("노무현은 살아있노 예아", 523)}
      if(!user){ throw new NotFoundException('유저를 찾지 못했습니다'); }
      if(!updateDto.nickname || updateDto.nickname.length > 30){ throw new BadRequestException('잘못된 이름값입니다'); }
      if(user.nickname == updateDto.nickname){ throw new BadRequestException('현재 사용중인 닉네임입니다.'); }
      if(await this.userRepository.findOne({where: {nickname: updateDto.nickname}})){ throw new BadRequestException('이미 사용중인 닉네임입니다'); }

      user.nickname = updateDto.nickname;
    }

    // 프사 설정
    if(updateDto.profileImage){
      user.profileImage = updateDto.profileImage;
    }
    
    await this.userRepository.save(user);

    const accsessToken = this.jwtService.sign({ sub: user.id, role: user.role, nickname: user.nickname }, { secret: process.env.JWT_ACCSESS_SECRET, expiresIn: '30m' });
    const refreshToken = this.jwtService.sign({ sub: user.id }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
    await this.redis.set(`refreshToken:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7일
    return {accsessToken, refreshToken}
  }

  async generateAccsessToken(refreshToken: string){
    if(!refreshToken) { throw new BadRequestException("refreshToken이 없습니다")}
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    } catch (e) {
      throw new NotFoundException('만료된 refresh 토큰입니다');
    }
    console.log(payload)

    const token = await this.redis.get(`refreshToken:${payload.sub}`);
    
    if (token != refreshToken) {
      await this.redis.del(`refreshToken:${payload.sub}`);
      throw new UnauthorizedException('탈취된 refresh token');
    }

    const newAccsess = this.jwtService.sign({ sub: payload.sub, role: payload.role }, { secret: process.env.JWT_ACCSESS_SECRET, expiresIn: '30m' });
    const newRefresh = this.jwtService.sign({ sub: payload.sub }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
    
    await this.redis.set(`refreshToken:${payload.sub}`, newRefresh, 'EX', 7 * 24 * 60 * 60);

    return { accsessToken: newAccsess, refreshToken: newRefresh };
  }

  async deleteUser(reqester, targetId) {
    if(reqester.role != "ADMIN" && reqester.id != targetId) { throw new ForbiddenException("해당 유저를 삭제할 권한이 없습니다."); }

    const user = await this.userRepository.findOne({where: {id: targetId}});
    user.isDeleted = true;
    await this.userRepository.save(user);

    return {
      statusCode: 204,
      message: "성공적으로 탈퇴하였습니다"
    }
  }

  async getUserProfile(userId) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['boardUser', 'boardUser.board']});
    return {
      userId: user.id,
      nickname: user.nickname,
      profileImage: user.profileImage,
      boards: user.boardUser.map(bu => {return {boardCode: bu.boardCode, boardTitle: bu.board.title, role: bu.role}})
    };
  }
}