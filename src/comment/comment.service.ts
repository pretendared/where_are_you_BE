import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { BoardUser } from 'src/board/entities/board.user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(BoardUser)
    private boardUserRepository: Repository<BoardUser>
  ) { }

  async create(user: any, createCommentDto: CreateCommentDto) {
    if (!createCommentDto.content || !createCommentDto.content.trim()) {
      throw new BadRequestException('댓글 내용이 비어있습니다.');
    }

    if (createCommentDto.content.length > 500) {
      throw new BadRequestException('댓글은 500자 미만입니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: createCommentDto.postId }
    });
    if (!post) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }

    const boardUser = await this.boardUserRepository.findOne({
      where: { boardCode: post.boardCode, userId: user.id }
    });
    if (user.role !== 'ADMIN' && !boardUser) {
      throw new ForbiddenException('해당 보드에 속해있지 않습니다');
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      postId: createCommentDto.postId,
      authorId: user.id,
    });

    return await this.commentRepository.save(comment);
  }

  async findAllByPost(user: any, postId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      select: ['boardCode']
    });
    if (!post) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }

    const boardUser = await this.boardUserRepository.findOne({
      where: { boardCode: post.boardCode, userId: user.id }
    });
    if (user.role !== 'ADMIN' && !boardUser) {
      throw new ForbiddenException('해당 보드에 속해있지 않습니다');
    }

    const comments = await this.commentRepository.find({
      where: { postId },
      relations: { author: true },
      order: { createdAt: 'ASC' }
    });

    return comments.map(comment => ({
      commentId: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        userId: comment.author.id,
        nickname: comment.author.nickname,
        profileImage: comment.author.profileImage,
      }
    }));
  }

  async update(user: any, commentId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: { post: true }
    });
    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (user.role !== 'ADMIN' && user.id !== comment.authorId) {
      throw new ForbiddenException('해당 댓글을 수정할 권한이 없습니다');
    }

    if (!updateCommentDto.content || !updateCommentDto.content.trim()) {
      throw new BadRequestException('댓글 내용이 비어있습니다.');
    }

    if (updateCommentDto.content.length > 500) {
      throw new BadRequestException('댓글은 500자 미만입니다.');
    }

    comment.content = updateCommentDto.content;
    return await this.commentRepository.save(comment);
  }

  async remove(user: any, commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId }
    });
    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (user.role !== 'ADMIN' && user.id !== comment.authorId) {
      throw new ForbiddenException('해당 댓글을 삭제할 권한이 없습니다');
    }

    await this.commentRepository.delete({ id: commentId });
  }
}
