import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: Types.ObjectId;

  @Prop({ type: String })
  sessionId?: string;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        selectedColor: { type: String, required: true },
        selectedSize: { type: String, required: true },
        quantity: { type: Number, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
    default: [],
  })
  items: {
    product: Types.ObjectId;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
    title: string;
    image: string;
    price: number;
    finalPrice: number;
  }[];

  @Prop({ required: true, default: 0 })
  totalPrice: number;

  @Prop({ required: true, default: 0 })
  totalQuantity: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
