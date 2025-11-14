import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
