import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  phoneNumber: string;
}
