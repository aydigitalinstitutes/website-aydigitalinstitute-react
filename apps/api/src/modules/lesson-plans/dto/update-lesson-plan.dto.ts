import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLessonPlanDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  gradeLevel?: string;
}
