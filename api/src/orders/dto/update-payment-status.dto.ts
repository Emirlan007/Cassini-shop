import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'paid', 'cancelled'])
  paymentStatus: 'pending' | 'paid' | 'cancelled';
}
