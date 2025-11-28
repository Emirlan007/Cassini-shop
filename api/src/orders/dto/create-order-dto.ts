import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNotEmpty()
  @IsString()
  @IsIn(['cash', 'qrCode'])
  paymentMethod: 'cash' | 'qrCode';

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'processing', 'completed'])
  status?: 'pending' | 'processing' | 'completed';

  @IsOptional()
  @IsString()
  userComment?: string;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
