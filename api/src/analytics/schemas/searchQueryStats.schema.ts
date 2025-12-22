import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SearchQueryStatsDocument = SearchQueryStats & Document;

@Schema()
export class SearchQueryStats {
  @Prop({ required: true, index: true })
  normalizedQuery: string;

  @Prop({ required: true })
  query: string;

  @Prop({ default: 0 })
  totalCount: number;

  @Prop({ default: 0 })
  uniqueUsers: number;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SearchQueryStatsSchema =
  SchemaFactory.createForClass(SearchQueryStats);
