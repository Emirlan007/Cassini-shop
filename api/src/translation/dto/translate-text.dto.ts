import { IsNotEmpty, IsString } from 'class-validator';

export class TranslateTextDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
