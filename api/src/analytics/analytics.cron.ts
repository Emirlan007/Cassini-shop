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
  count: number;
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

  @Cron('5 0 * * *')
  async aggregateProductViews() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const date = yesterday.toISOString().split('T')[0];
    const dayStart = date + 'T00:00:00.000Z';
    const dayEnd = date + 'T23:59:59.999Z';

    const events = await this.eventModel.aggregate<AggregatedEvent>([
      {
        $match: {
          createdAt: {
            $gte: new Date(dayStart),
            $lte: new Date(dayEnd),
          },
        },
      },
      {
        $group: {
          _id: '$productId',
          count: { $sum: 1 },
          qty_sum: { $sum: '$qty' },
        },
      },
    ]);

    for (const item of events) {
      await this.productStatsByDayModel.findOneAndUpdate(
        { date: date, product: item._id },
        {
          $inc: { views: item.count },
        },
        { upsert: true, new: true },
      );
    }

    return { status: 'ok' };
  }
}
