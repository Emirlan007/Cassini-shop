import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema()
export class Banner {
  @Prop({ required: true })
  title: string;

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
