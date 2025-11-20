import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Transform(transformToArray)
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
  @ValidateIf((o: CreateProductDto) => o.imagesByColor !== undefined)
  imagesByColor?: Record<string, string[]>;
}
