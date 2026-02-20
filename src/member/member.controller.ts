import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';

@Controller(':boardCode/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(JwtGuard)
  @Get('/list')
  async getMembers(@Param('boardCode') boardCode){
    return this.memberService.getMembers(boardCode);
  }

  @Patch('update/:memberId')
  @UseGuards(JwtGuard)
  async updateMemberRole(@Param('boardCode') boardCode, @Req() req, @Body() Body, @Param('memberId') memberId){
    return this.memberService.updateMemberRole(boardCode, req.user, memberId, Body.role)
  }

  @Delete('delete/:memberId')
  @UseGuards(JwtGuard)
  async kickMember(@Param('boardCode') boardCode, @Req() req, @Param('memberId') memberId){
    return this.memberService.kickMember(boardCode, req.user, memberId)
  }
}
