import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
    private jwtService: JwtService,
  ) {}

  async googleLogin(googleUser: {googleId: string, email: string, name: string}) {
    let user = await this.userRepository.findOne({ where: { id: googleUser.googleId } });
    if (!user) {
      user = this.userRepository.create({
        id: googleUser.googleId,
        email: googleUser.email,
      });
      await this.userRepository.save(user);
    }

    if(!user.nickname){
      return {
        status: 200,
        needNickname: true,
        accsessToken: this.jwtService.sign({ sub: user.id,}, { secret: process.env.JWT_ACCSESS_SECRET, expiresIn: '30m' }),
      }
    }
    const accsessToken = this.jwtService.sign({ sub: user.id, nickname: user.nickname }, { secret: process.env.JWT_ACCSESS_SECRET, expiresIn: '30m' });
    const refreshToken = this.jwtService.sign({ sub: user.id, nickname: user.nickname }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

    await this.redis.set(`refreshToken:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7일
    return { accsessToken, refreshToken };
  }

  async setNickname(userId: string, nickname: string){
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if(!user){
      throw new NotFoundException('유저를 찾지 못했습니다');
    }

    user.nickname = nickname;
    await this.userRepository.save(user);
    return this.jwtService.sign({ sub: user.id, nickname: user.nickname });
  }

  
  async generateAccsessToken(refreshToken: string){
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    } catch (e) {
      throw new NotFoundException('만료된 refresh 토큰입니다');
    }
    const storedToken = await this.redis.get(`refresh:${payload.sub}`);
    
    if (storedToken !== refreshToken) {
      throw new UnauthorizedException('탈취된 refresh token');
    }

    const newAccsess = this.jwtService.sign({ sub: payload.sub, nickname: payload.nickname }, { secret: process.env.JWT_ACCSESS_SECRET, expiresIn: '30m' });
    return { accsessToken: newAccsess };
  }
}