import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = Category & Document;

export class TranslatedField {
  @Prop({ required: true })
  ru: string;

  @Prop({ required: true })
  en: string;

  @Prop({ required: true })
  kg: string;
}

@Schema()
export class Category {
  @Prop({ required: true, type: TranslatedField })
  title: TranslatedField;

  @Prop({ required: true, unique: true })
  slug: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
