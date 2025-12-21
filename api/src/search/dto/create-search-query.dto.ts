import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateSearchQueryDto {
  @IsString()
  @MinLength(2, { message: 'Query must be at least 2 characters long' })
  query: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
