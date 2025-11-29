import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  // @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  displayName: string;
}
