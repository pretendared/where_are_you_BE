import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsDateString, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
}