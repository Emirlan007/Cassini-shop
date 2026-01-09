import { IsArray, IsString, IsOptional } from 'class-validator';

export class TrackSearchImpressionsDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}