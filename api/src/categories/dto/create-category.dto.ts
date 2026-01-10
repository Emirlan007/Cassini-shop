import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TranslatedFieldDto {
  @IsString()
  @IsNotEmpty()
  ru: string;

  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  kg: string;
}

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  @IsNotEmpty()
  title: TranslatedFieldDto;

  @IsString()
  @IsOptional()
  slug?: string;
}
