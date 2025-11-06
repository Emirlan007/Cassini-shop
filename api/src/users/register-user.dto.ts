import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { IsUserExists } from 'src/validators/is-user-exists.validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUserExists(false)
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  displayName: string;
}
