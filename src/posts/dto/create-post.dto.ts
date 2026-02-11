export enum PostType {
  notice = "NOTICE",
  nomal = "NOMAL"
}

export class CreatePostDto {
  type: PostType;
  title: string;
  content: string;
}
