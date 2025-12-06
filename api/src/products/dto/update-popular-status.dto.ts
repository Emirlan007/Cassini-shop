import { IsBoolean } from 'class-validator';

export class UpdatePopularStatusDto {
  @IsBoolean()
  isPopular: boolean;
}
