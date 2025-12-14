import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductStatsByDayDocument = ProductStatsByDay & Document;

@Schema()
export class ProductStatsByDay {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 0 })
  searchImpressions: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  addToCart: number;

  @Prop({ default: 0 })
  addToCartQty: number;

  @Prop({ default: 0 })
  wishlistCount: number;

  @Prop({ default: 0 })
  ordersCount: number;

  @Prop({ default: 0 })
  paidCount: number;

  @Prop({ default: 0 })
  refundCount: number;
}

export const ProductStatsByDaySchema =
  SchemaFactory.createForClass(ProductStatsByDay);
