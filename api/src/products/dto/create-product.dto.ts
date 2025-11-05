import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  colors: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  size: string[];

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  image?: string;
}