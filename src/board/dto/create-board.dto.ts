import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
export class CreateBoardDto {
  @Length(1, 10, {message: "1글자 이상 10글자 이하로 작성해주세요"})
  @IsString()
  title: string;
}