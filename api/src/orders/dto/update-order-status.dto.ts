import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'paid', 'cancelled'])
  orderStatus: 'pending' | 'paid' | 'cancelled';
}
