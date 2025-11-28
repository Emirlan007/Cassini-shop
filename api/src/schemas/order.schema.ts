import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: {
    product: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'completed'],
    default: 'pending',
  })
  status: 'pending' | 'processing' | 'completed';

  @Prop({
    type: String,
    enum: ['cash', 'qrCode'],
    required: true,
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
