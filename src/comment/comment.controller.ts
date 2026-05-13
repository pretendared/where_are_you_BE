import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: any;
}

@Controller()
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('posts/:postId/comments')
  async create(@Req() req: RequestWithUser, @Param('postId') postId: string, @Body() createCommentDto: CreateCommentDto) {
    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) {
      throw new BadRequestException('postId는 숫자여야 합니다.');
    }

    if (createCommentDto.postId !== postIdNum) {
      throw new BadRequestException('URL의 postId와 body의 postId가 일치하지 않습니다.');
    }

    return this.commentService.create(req.user, createCommentDto);
  }

  @Get('posts/:postId/comments')
  async findAllByPost(@Req() req: RequestWithUser, @Param('postId') postId: string) {
    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) {
      throw new BadRequestException('postId는 숫자여야 합니다.');
    }

    return this.commentService.findAllByPost(req.user, postIdNum);
  }

  @Patch('comments/:id')
  async update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    const commentId = parseInt(id);
    if (isNaN(commentId)) {
      throw new BadRequestException('댓글 ID는 숫자여야 합니다.');
    }

    return this.commentService.update(req.user, commentId, updateCommentDto);
  }

  @Delete('comments/:id')
  async remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    const commentId = parseInt(id);
    if (isNaN(commentId)) {
      throw new BadRequestException('댓글 ID는 숫자여야 합니다.');
    }

    return this.commentService.remove(req.user, commentId);
  }
}
