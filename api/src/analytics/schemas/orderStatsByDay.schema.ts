import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderStatsByDayDocument = OrderStatsByDay & Document;

@Schema()
export class OrderStatsByDay {
  @Prop({ required: true })
  date: Date;

  @Prop({ default: 0 })
  ordersCreated: number;

  @Prop({ default: 0 })
  ordersCanceled: number;

  @Prop({ default: 0 })
  ordersPaid: number;

  @Prop({ default: 0 })
  revenue: number;
}

export const OrderStatsByDaySchema =
  SchemaFactory.createForClass(OrderStatsByDay);

OrderStatsByDaySchema.index({ date: 1 });
