import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phoneNumber: string;
}
