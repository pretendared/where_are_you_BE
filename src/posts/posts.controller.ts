import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';

@Controller(':boardCode/post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post("/create")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Param('boardCode') boardCode, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user, boardCode, createPostDto);
  }

  @Get("/list")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req, @Param("boardCode") boardCode) {
    return this.postService.findAll(req.user, boardCode);
  }

  @Get('/:postId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Req() req, @Param('postId') id: string) {
    return this.postService.findOne(req.user, +id);
  }

  @Patch('/update/:postId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  update(@Req() req, @Param('PostId') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(req.uesr, +id, updatePostDto);
  }

  @Delete('/delete/:postId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('postId') id: string) {
    return this.postService.remove(req.uesr, +id);
  }
}
