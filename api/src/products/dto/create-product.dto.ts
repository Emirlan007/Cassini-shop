import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  IsBoolean,
  IsDefined,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AVAILABLE_SIZES } from '../../shared/constants/sizes.constant';

const transformToArray = ({ value }: { value: unknown }): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [value];
    }
  }
  return [];
};

function transformToObject<T>(value: unknown): T | undefined {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  return value as T;
}

export class TranslatedFieldDto {
  @IsString()
  @IsNotEmpty()
  ru: string;

  @IsOptional()
  @IsString()
  en?: string;

  @IsOptional()
  @IsString()
  kg?: string;
}

export class CreateProductDto {
  @IsDefined()
  @Transform(({ value }) => transformToObject<TranslatedFieldDto>(value))
  @Type(() => TranslatedFieldDto)
  name: TranslatedFieldDto;

  @IsOptional()
  @Transform(({ value }) => transformToObject<TranslatedFieldDto>(value))
  @Type(() => TranslatedFieldDto)
  description?: TranslatedFieldDto;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Transform((value) => transformToArray(value))
  colors: string[];

  @IsArray()
  @IsIn(AVAILABLE_SIZES, { each: true })
  @Transform((value) => transformToArray(value))
  size: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price: number;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform((value) => transformToArray(value))
  images?: string[];

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          !Array.isArray(parsed)
        ) {
          return parsed as Record<string, number[]>;
        }
        return value;
      } catch {
        return value;
      }
    }
    return value;
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
  @Transform(({ value }) => transformToObject<TranslatedFieldDto>(value))
  @Type(() => TranslatedFieldDto)
  material?: TranslatedFieldDto;
}
