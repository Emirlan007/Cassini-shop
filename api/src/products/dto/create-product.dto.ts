import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  IsBoolean,
  IsPositive,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AVAILABLE_SIZES } from '../../shared/constants/sizes.constant';

const transformToArray = ({ value }: { value: unknown }): string[] => {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as string[]) : [parsed as string];
    } catch {
      return [value];
    }
  }
  return [];
};

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Transform(transformToArray)
  colors: string[];

  @IsArray()
  @IsIn(AVAILABLE_SIZES, { each: true })
  @Transform(transformToArray)
  size: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive({ message: 'Цена должна быть положительным числом' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(transformToArray)
  images?: string[];

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as Record<string, number[]>;
      } catch {
        return {};
      }
    }
    return value as Record<string, number[]>;
  })
  @ValidateIf((o: CreateProductDto) => o.imagesByColor !== undefined)
  imagesByColor?: Record<string, number[]>;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isNew?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  inStock: boolean;

  @IsOptional()
  @IsString()
  material?: string;
}
