import { IsString, IsInt, Min, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @Min(1)
  postId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
