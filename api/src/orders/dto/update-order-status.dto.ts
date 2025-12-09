import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../enums/order.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: `Status must be one of: ${Object.values(OrderStatus).join(', ')}`,
  })
  status: OrderStatus;
}
