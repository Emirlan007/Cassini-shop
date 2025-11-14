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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  category?: Types.ObjectId[];

  @Prop({ required: true })
  price: number;

  @Prop()
  video?: string;

  @Prop({ type: [String] })
  images?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
