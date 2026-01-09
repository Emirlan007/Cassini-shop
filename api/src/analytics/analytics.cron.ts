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
import {
  SearchQuery,
  SearchQueryDocument,
} from 'src/schemas/search-query.schema';
import {
  SearchQueryStats,
  SearchQueryStatsDocument,
} from './schemas/searchQueryStats.schema';

interface AggregatedProduct {
  _id: string;
  searchImpressions: number;
  views: number;
  addToCart: number;
  addToCartQty: number;
  wishlistCount: number;
}

interface AggregatedOrder {
  _id: string;
  ordersCreated: number;
  ordersCanceled: number;
  ordersPaid: number;
  revenue: number;
}

interface AggregatedSearchQueries {
  _id: string;
  normalizedQuery: string;
  query: string;
  totalCount: number;
  uniqueUsers: number;
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

    @InjectModel(SearchQuery.name)
    private searchQueryModel: Model<SearchQueryDocument>,

    @InjectModel(SearchQueryStats.name)
    private searchQueryStatsModel: Model<SearchQueryStatsDocument>,
  ) {}

  @Cron('* * * * *')
  async aggregateProductStatsByDay() {
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

          searchImpressions: {
            $sum: {
              $cond: [{ $eq: ['$type', 'product_search_impression'] }, 1, 0],
            },
          },

          views: {
            $sum: {
              $cond: [{ $eq: ['$type', 'product_view'] }, 1, 0],
            },
          },

          addToCart: {
            $sum: {
              $cond: [{ $eq: ['$type', 'add_to_cart'] }, 1, 0],
            },
          },

          addToCartQty: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'add_to_cart'] },
                { $ifNull: ['$qty', 1] },
                0,
              ],
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
      console.log(
        `Product ${item._id}: searchImpressions=${item.searchImpressions}, views=${item.views}, cart=${item.addToCart}, wishlist=${item.wishlistCount}`,
      );

      await this.productStatsByDayModel.findOneAndUpdate(
        {
          date: new Date(`${dateStr}T00:00:00.000Z`),
          productId: item._id,
        },
        {
          $set: {
            searchImpressions: item.searchImpressions,
            views: item.views,
            addToCart: item.addToCart,
            addToCartQty: item.addToCartQty,
            wishlistCount: item.wishlistCount,
          },
        },
        { upsert: true },
      );
    }

    return { status: 'ok' };
  }

  @Cron('* * * * *')
  async aggregateOrderStatsByDay() {
    const dateStr = new Date().toISOString().split('T')[0];
    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const [events] = await this.eventModel.aggregate<AggregatedOrder>([
      {
        $match: {
          createdAt: { $gte: dayStart, $lte: dayEnd },
          type: {
            $in: ['order_created', 'order_canceled', 'order_paid'],
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

          ordersPaid: {
            $sum: {
              $cond: [{ $eq: ['$type', 'order_paid'] }, 1, 0],
            },
          },

          revenue: {
            $sum: {
              $cond: [{ $eq: ['$type', 'order_paid'] }, '$order.totalPrice', 0],
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
          ordersPaid: events?.ordersPaid ?? 0,
          revenue: events?.revenue ?? 0,
        },
      },
      { upsert: true },
    );

    return { status: 'ok' };
  }

  @Cron('15 0 * * *')
  async aggregateSearchQuery() {
    const stats =
      await this.searchQueryModel.aggregate<AggregatedSearchQueries>([
        {
          $group: {
            _id: '$normalizedQuery',
            query: { $first: '$query' },
            totalCount: { $sum: 1 },
            users: {
              $addToSet: {
                $cond: [
                  { $ifNull: ['$userId', false] },
                  '$userId',
                  '$sessionId',
                ],
              },
            },
          },
        },
        {
          $project: {
            normalizedQuery: '$_id',
            query: 1,
            totalCount: 1,
            uniqueUsers: { $size: '$users' },
          },
        },
      ]);

    for (const item of stats) {
      await this.searchQueryStatsModel.findOneAndUpdate(
        { normalizedQuery: item.normalizedQuery },
        {
          $set: {
            query: item.query,
            totalCount: item.totalCount,
            uniqueUsers: item.uniqueUsers,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    }
  }
}