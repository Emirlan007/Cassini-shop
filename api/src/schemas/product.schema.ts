import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  colors: string[];

  @Prop()
  description?: string;

  @Prop({ type: [String], required: true })
  size: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop()
  video?: string;

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ type: Map, of: [String] })
  imagesByColor?: Record<string, string[]>;

  @Prop({ min: 0, max: 100 })
  discount?: number;

  @Prop()
  discountUntil?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index(
  {
    name: 'text',
    colors: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 3,
      colors: 2,
      description: 1,
    },
  },
);

ProductSchema.virtual('finalPrice').get(function () {
  const now = new Date();

  if (this.discount && this.discountUntil && this.discountUntil < now) {
    return this.price;
  }

  if (this.discount) {
    return Math.round(this.price * (1 - this.discount / 100));
  }

  return this.price;
});

ProductSchema.set('toJSON', { virtuals: true });
