import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Board } from 'src/board/entities/board.entity';
import { BoardUserEntity } from 'src/board/entities/board.user.entity';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(BoardUserEntity)
    private boardUserRepository: Repository<BoardUserEntity>
  ){}

  async create(user: any, boardCode: string, createPostDto: CreatePostDto) {
    console.log(user)
    console.log(boardCode)
    console.log(createPostDto)

    if (!createPostDto || !createPostDto.title) {throw new BadRequestException('제목이 비어있습니다.');}
    if (!createPostDto.content) {throw new BadRequestException('내용이 비어있습니다.');}
    if (createPostDto.title.length < 50 || createPostDto.content.length > 500) {throw new BadRequestException('제목은 50자 이상 500자 미만입니다.');}

    const board = await this.boardRepository.findOne({ where: { boardCode } });
    if (!board) {throw new NotFoundException('해당 보드를 찾을 수 없습니다.');}

    const boardUser = await this.boardUserRepository.findOne({where: {boardCode, userId: user.id}})
    if(user.role != "ADMIN" && !boardUser) {throw new ForbiddenException("해당 보드에 속해있지 않습니다")}

    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      boardCode,
      authorId: user?.id,
    });

    return this.postRepository.save(post);
  }

  async findAll(user: any, boardCode: string) {
    const board = await this.boardRepository.findOne({ where: { boardCode } });
    if (!board) {throw new NotFoundException('해당 보드를 찾을 수 없습니다.');}

    const boardUser = await this.boardUserRepository.findOne({where: {boardCode, userId: user.id}})
    if(user.role != "ADMIN" && !boardUser) {throw new ForbiddenException("해당 보드에 속해있지 않습니다")}

    const posts = await this.postRepository.find({
      where: { boardCode },
      relations: { author: true },
      order: { createdAt: 'DESC' },
    });

    return posts.map(post => ({
      postId: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      author: {
        nickname: post.author.nickname,
        profileImage: post.author.profileImage,
      },
    }));
  }

  async findOne(user: any, postId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: { author: true },
    });
    if (!post) {throw new NotFoundException('해당 게시물을 찾을 수 없습니다');}

    const boardUser = await this.boardUserRepository.findOne({where: {boardCode: post.boardCode, userId: user.id}})
    if(user.role != "ADMIN" && !boardUser) {throw new ForbiddenException("해당 보드에 속해있지 않습니다")}

    return {
      postId: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      author: {
        nickname: post.author.nickname,
        profileImage: post.author.profileImage,
      },
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async boardCheck(boardCode: string, user) {
    
  }
}
