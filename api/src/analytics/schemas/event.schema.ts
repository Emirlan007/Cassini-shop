import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventType } from 'src/enums/event.enum';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({
    type: String,
    required: true,
    enum: EventType,
  })
  type: EventType;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ type: String })
  sessionId?: string;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId?: Types.ObjectId;

  @Prop({ type: Number })
  qty?: number;

  @Prop({ type: Object })
  payload?: object;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

EventSchema.index({ type: 1, createdAt: 1 });

EventSchema.index({ product: 1, createdAt: 1 });

EventSchema.index({ sessionId: 1, createdAt: 1 });

EventSchema.index({ order: 1 });
