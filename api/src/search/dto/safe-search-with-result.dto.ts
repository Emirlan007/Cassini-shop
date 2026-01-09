import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateSearchQueryDto } from './create-search-query.dto';

export class SaveSearchWithResultsDto extends CreateSearchQueryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}
