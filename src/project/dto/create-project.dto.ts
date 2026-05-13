import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @IsDateString()
  startedAt: Date;
  @IsDateString()
  endedAt: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  titleImage: string;
}
