import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderHistoryDocument = OrderHistory & Document;

@Schema()
export class OrderHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        selectedColor: { type: String, required: true },
        selectedSize: { type: String, required: true },
        price: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: Array<{
    product: Types.ObjectId;
    title: string;
    image: string;
    selectedColor: string;
    selectedSize: string;
    price: number;
    finalPrice: number;
    quantity: number;
  }>;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: String, required: true })
  paymentMethod: string;

  @Prop({ required: true })
  completedAt: Date;
}

export const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory);
