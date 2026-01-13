import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Event, EventSchema } from './schemas/event.schema';
import {
  ProductStatsByDay,
  ProductStatsByDaySchema,
} from './schemas/productStatsByDay.schema';
import { AnalyticsCron } from './analytics.cron';
import {
  OrderStatsByDay,
  OrderStatsByDaySchema,
} from './schemas/orderStatsByDay.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { SearchQuery, SearchQuerySchema } from '../schemas/search-query.schema';
import {
  SearchQueryStats,
  SearchQueryStatsSchema,
} from './schemas/searchQueryStats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: ProductStatsByDay.name, schema: ProductStatsByDaySchema },
      { name: OrderStatsByDay.name, schema: OrderStatsByDaySchema },
      { name: SearchQuery.name, schema: SearchQuerySchema },
      { name: SearchQueryStats.name, schema: SearchQueryStatsSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsCron],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
