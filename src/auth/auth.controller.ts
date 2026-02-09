import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { userUpdateDto } from './dto/update.dto';
import { JwtGuard } from './gurad/jwt.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {} // 어짜피 구글 로그인으로 리다이렉트 되므로 빈 함수로 둠

  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {
    return await this.authService.Login(req.user);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Req() req, @Param('id') targetId, @Body() updateDto: userUpdateDto) {
    return await this.authService.update(req.user, targetId, updateDto);
  }

  @Post('token/refresh')
  async generateAccsessToken(@Body('refreshToken') refreshToken: string) {
    if(!refreshToken){
      throw new UnauthorizedException('리프레시 토큰이 없습니다');
    }

    return await this.authService.generateAccsessToken(refreshToken);
  }
  @UseGuards(JwtGuard)
  @Get('/')
  async getUserProfile(@Req() req, ){
    return this.authService.getUserProfile(req.user.id);
  }
}