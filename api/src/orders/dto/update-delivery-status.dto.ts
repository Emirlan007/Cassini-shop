import { IsEnum } from 'class-validator';
import { DeliveryStatus } from '../../enums/order.enum';

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;
}
