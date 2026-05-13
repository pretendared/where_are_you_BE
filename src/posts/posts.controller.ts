import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';

@Controller('/post')
@UseGuards(JwtGuard)
export class PostsController {
  constructor(private readonly postService: PostsService) { }

  @Post("/create/:boardCode")
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Param('boardCode') boardCode, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user, boardCode, createPostDto);
  }

  @Get("/list/:boardCode")
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req, @Param("boardCode") boardCode) {
    return this.postService.findAll(req.user, boardCode);
  }

  @Get('/:postId')
  @HttpCode(HttpStatus.OK)
  findOne(@Req() req, @Param('postId') id: string) {
    return this.postService.findOne(req.user, +id);
  }

  @Patch('/update/:postId')
  @HttpCode(HttpStatus.OK)
  update(@Req() req, @Param('postId') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(req.user, +id, updatePostDto);
  }

  @Delete('/delete/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('postId') id: string) {
    return this.postService.remove(req.user, +id);
  }
}
