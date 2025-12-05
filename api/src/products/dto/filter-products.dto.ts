import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

const splitString = ({ value }: { value: string | string[] }) =>
  typeof value === 'string'
    ? value
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    : value;

const toBoolean = ({ value }: { value: any }) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

export class FilterProductsDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsOptional()
  @Transform(splitString)
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @Transform(splitString)
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number = 16;

  @IsOptional()
  @IsString()
  @IsIn(['price', 'name', 'createdAt'])
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}
