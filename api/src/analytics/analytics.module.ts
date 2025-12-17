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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: ProductStatsByDay.name, schema: ProductStatsByDaySchema },
      { name: OrderStatsByDay.name, schema: OrderStatsByDaySchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsCron],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
