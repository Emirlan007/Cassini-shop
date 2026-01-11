import { IsArray, IsString, IsOptional, ArrayNotEmpty } from 'class-validator';

export class TrackSearchImpressionsDto {
  @IsArray()
  @ArrayNotEmpty()
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
