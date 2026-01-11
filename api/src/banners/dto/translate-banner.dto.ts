import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TranslatedFieldDto {
  @IsString()
  @IsNotEmpty()
  ru: string;

  @IsString()
  @IsOptional()
  en?: string;

  @IsString()
  @IsOptional()
  kg?: string;
}
