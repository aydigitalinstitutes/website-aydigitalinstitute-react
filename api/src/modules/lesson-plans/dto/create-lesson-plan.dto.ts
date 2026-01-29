import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonPlanDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  gradeLevel!: string;
}
