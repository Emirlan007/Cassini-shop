import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DeliveryStatus, OrderStatus } from '../enums/order.enum';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        selectedColor: { type: String, required: true },
        selectedSize: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: {
    productId: Types.ObjectId;
    title: string;
    image: string;
    selectedColor: string;
    selectedSize: string;
    price: number;
    quantity: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Prop({
    type: String,
    enum: DeliveryStatus,
    default: DeliveryStatus.Warehouse,
  })
  deliveryStatus: DeliveryStatus;

  @Prop({
    type: String,
    enum: ['cash', 'qrCode'],
    default: 'cash',
  })
  paymentMethod: 'cash' | 'qrCode';

  @Prop({ type: String, default: null })
  userComment: string | null;

  @Prop({ type: [String], default: [] })
  adminComments: string[];

  @Prop({ required: true })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
