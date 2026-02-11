import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from 'src/auth/gurad/jwt.guard';

@Controller(':boardCode/post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post("/create")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Param('boardCode') boardCode, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user, boardCode, createPostDto);
  }

  @Get("/list")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req, @Param("boardCode") boardCode) {
    return this.postsService.findAll(req.user, boardCode);
  }

  @Get('/:postId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Req() req, @Param('postId') id: string) {
    return this.postsService.findOne(req.user, +id);
  }

  @Patch('/update/:postId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('PostId') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete('/delete/:postId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('postId') id: string) {
    return this.postsService.remove(+id);
  }
}
