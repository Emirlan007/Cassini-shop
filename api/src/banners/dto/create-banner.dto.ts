import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatedFieldDto } from './translate-banner.dto';
import { type TranslatedField } from '../../translation/translation.service';

export class CreateBannerDto {
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  @IsNotEmpty()
  title: TranslatedField;

  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  @IsOptional()
  description?: TranslatedField;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
