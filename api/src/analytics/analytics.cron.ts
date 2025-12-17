import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductStatsByDay,
  ProductStatsByDayDocument,
} from './schemas/productStatsByDay.schema';
import { EventDocument } from './schemas/event.schema';
import {
  OrderStatsByDay,
  OrderStatsByDayDocument,
} from './schemas/orderStatsByDay.schema';

interface AggregatedProduct {
  _id: string;
  views: number;
  wishlistCount: number;
  qty_sum: number;
}

interface AggregatedOrder {
  _id: string;
  ordersCreated: number;
  ordersCanceled: number;
  ordersCompleted: number;
  revenue: number;
}

@Injectable()
export class AnalyticsCron {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,

    @InjectModel(ProductStatsByDay.name)
    private productStatsByDayModel: Model<ProductStatsByDayDocument>,

    @InjectModel(OrderStatsByDay.name)
    private orderStatsByDayModel: Model<OrderStatsByDayDocument>,
  ) {}

  @Cron('5 0 * * *')
  async aggregateProductStatsByDay() {
    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);

    // const dateStr = yesterday.toISOString().split('T')[0];
    // const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    // const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const dateStr = new Date().toISOString().split('T')[0];

    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const events = await this.eventModel.aggregate<AggregatedProduct>([
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

  @Cron('10 0 * * *')
  async aggregateOrderStatsByDay() {
    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);

    // const dateStr = yesterday.toISOString().split('T')[0];
    // const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    // const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const dateStr = new Date().toISOString().split('T')[0];

    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const [events] = await this.eventModel.aggregate<AggregatedOrder>([
      {
        $match: {
          createdAt: { $gte: dayStart, $lte: dayEnd },
          type: {
            $in: ['order_created', 'order_canceled', 'order_completed'],
          },
        },
      },

      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: '_id',
          as: 'order',
        },
      },
      { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: null,

          ordersCreated: {
            $sum: {
              $cond: [{ $eq: ['$type', 'order_created'] }, 1, 0],
            },
          },

          ordersCanceled: {
            $sum: {
              $cond: [{ $eq: ['$type', 'order_canceled'] }, 1, 0],
            },
          },

          ordersCompleted: {
            $sum: {
              $cond: [{ $eq: ['$type', 'order_completed'] }, 1, 0],
            },
          },

          revenue: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'order_completed'] },
                '$order.totalPrice',
                0,
              ],
            },
          },
        },
      },
    ]);

    await this.orderStatsByDayModel.findOneAndUpdate(
      { date: dayStart },
      {
        $set: {
          ordersCreated: events?.ordersCreated ?? 0,
          ordersCanceled: events?.ordersCanceled ?? 0,
          ordersCompleted: events?.ordersCompleted ?? 0,
          revenue: events?.revenue ?? 0,
        },
      },
      { upsert: true },
    );

    return { status: 'ok' };
  }
}
