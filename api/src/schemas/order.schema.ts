import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [], required: true })
  items: [
    {
      productId: Types.ObjectId;
      title: string;
      price: number;
      quantity: number;
      selectedColor: string;
      selectedSize: string;
      image: string;
    },
  ];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
