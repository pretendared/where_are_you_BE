import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {} // 어짜피 구글 로그인으로 리다이렉트 되므로 빈 함수로 둠

  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {
    return await this.authService.googleLogin(req.user);
  }

  @Patch('nickname')
  @UseGuards(AuthGuard('jwt'))
  async setNickname(@Req() req, @Body('nickname') nickname: string) {
    const userId = req.user.sub;
    return await this.authService.setNickname(userId, nickname);
  }

  @Post('token/refresh')
  async generateAccsessToken(@Body('refreshToken') refreshToken: string) {
    if(!refreshToken){
      throw new UnauthorizedException('리프레시 토큰이 없습니다');
    }

    return await this.authService.generateAccsessToken(refreshToken);
  }
}