import { IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  // @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  city: string;

  @IsOptional()
  address: string;
}
