import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['unpaid', 'paid', 'cancelled'])
  paymentStatus: 'unpaid' | 'paid' | 'cancelled';
}
