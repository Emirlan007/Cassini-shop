import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductStatsByDay,
  ProductStatsByDayDocument,
} from './schemas/productStatsByDay.schema';
import { EventDocument } from './schemas/event.schema';

interface AggregatedEvent {
  _id: string;
  views: number;
  wishlistCount: number;
  qty_sum: number;
}

@Injectable()
export class AnalyticsCron {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,

    @InjectModel(ProductStatsByDay.name)
    private productStatsByDayModel: Model<ProductStatsByDayDocument>,
  ) {}

  @Cron('* * * * *')
  async aggregateProductStatsByDay() {
    console.log('aggregate product events');

    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);

    // const dateStr = yesterday.toISOString().split('T')[0];
    // const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    // const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const dateStr = new Date().toISOString().split('T')[0];

    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const events = await this.eventModel.aggregate<AggregatedEvent>([
      {
        $match: {
          createdAt: { $gte: dayStart, $lte: dayEnd },
          productId: { $exists: true },
        },
      },
      {
        $group: {
          _id: '$productId',

          views: {
            $sum: {
              $cond: [{ $eq: ['$type', 'product_view'] }, 1, 0],
            },
          },

          wishlistCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'add_to_wishlist'] }, 1, 0],
            },
          },
        },
      },
    ]);

    for (const item of events) {
      await this.productStatsByDayModel.findOneAndUpdate(
        {
          date: new Date(`${dateStr}T00:00:00.000Z`),
          productId: item._id,
        },
        {
          $set: {
            views: item.views,
            wishlistCount: item.wishlistCount,
          },
        },
        { upsert: true },
      );
    }

    return { status: 'ok' };
  }
}
