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
} from 'class-validator';
import { Transform } from 'class-transformer';
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
  @Transform((value) => transformToArray(value))
  colors: string[];

  //Available sizes: XS, S, M, L, XL, XXL, XXXL
  @IsArray()
  @IsIn(AVAILABLE_SIZES, { each: true })
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
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  @ValidateIf((o: CreateProductDto) => o.imagesByColor !== undefined)
  @IsObject()
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
  inStock: boolean;

  @IsOptional()
  @IsString()
  material?: string;
}
