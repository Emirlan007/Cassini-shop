import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { type TranslatedField } from '../translation/translation.service';

export type BannerDocument = Banner & Document;

@Schema()
export class Banner {
  @Prop({
    type: {
      ru: { type: String, required: true },
      en: { type: String },
      kg: { type: String },
    },
    required: true,
  })
  title: TranslatedField;

  @Prop()
  description?: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  link?: string;

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;
}
export const BannerSchema = SchemaFactory.createForClass(Banner);
