import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  selectedColor: string;

  @IsNotEmpty()
  @IsString()
  selectedSize: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image: string;
}
