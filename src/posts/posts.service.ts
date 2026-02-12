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
    if (!createPostDto.title || !createPostDto.title.trim()) {throw new BadRequestException('제목이 비어있습니다.');}
    if (!createPostDto.content || !createPostDto.content.trim() ) {throw new BadRequestException('내용이 비어있습니다.');}
    if (createPostDto.content.length > 50) {throw new BadRequestException('제목은 1자 이상 50자 미만입니다.');}
    if (createPostDto.content.length > 500) {throw new BadRequestException("본문은 1자 이상 500자 미만입니다.")}

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

  async findOne(user: {id: string, role: string}, postId: number) {
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

  async update(user: {id: string, role: string}, id: number, updatePostDto: UpdatePostDto) {
    let post = await this.postRepository.findOne({where: {id}});

    if(!post) {throw new NotFoundException("해당 게시물을 찾을 수 없습니다")}
    if(user.role != "ADMIN" && user.id != post.authorId) { throw new ForbiddenException("해당 게시물을 수정할 권한이 없습니다")}

    return this.postRepository.merge(post, updatePostDto);
  }

  async remove(user: {id: string, role: string}, id: number) {
    const post = await this.postRepository.findOne({where: {id}});
    if(!post) {throw new NotFoundException("해당 게시물을 찾을 수 없습니다")}
    if(user.role != "ADMIN", post.authorId != user.id) { throw new ForbiddenException("해당 게시물을 삭제할 권한이 없습니다");}
    
    await this.postRepository.delete({id});
  }
}
