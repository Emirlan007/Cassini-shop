import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SearchQueryDocument = SearchQuery & Document;

@Schema({ timestamps: true })
export class SearchQuery {
  @Prop({ required: true, index: true })
  query: string;

  @Prop({ required: true })
  normalizedQuery: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId?: Types.ObjectId;

  @Prop({ default: null })
  sessionId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SearchQuerySchema = SchemaFactory.createForClass(SearchQuery);

SearchQuerySchema.index({ normalizedQuery: 1, createdAt: -1 });
SearchQuerySchema.index({ userId: 1, createdAt: -1 });
SearchQuerySchema.index({ createdAt: -1 });
