import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { type TranslatedField } from 'src/translation/translation.service';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    type: {
      ru: { type: String, required: true },
      en: { type: String },
      kg: { type: String },
    },
    required: true,
  })
  name: TranslatedField;

  @Prop({ type: [String], required: true })
  colors: string[];

  @Prop({
    type: {
      ru: { type: String },
      en: { type: String },
      kg: { type: String },
    },
  })
  description?: TranslatedField;

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

  @Prop({ type: Map, of: [Number] })
  imagesByColor?: Record<string, number[]>;

  @Prop({ min: 0, max: 100 })
  discount?: number;

  @Prop()
  discountUntil?: Date;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true })
  isNew: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    type: {
      ru: { type: String },
      en: { type: String },
      kg: { type: String },
    },
  })
  material: TranslatedField;

  @Prop({ default: true })
  inStock: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ slug: 1 }, { unique: true });

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
