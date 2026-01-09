import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from 'src/analytics/schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { ProductStatsByDay } from './schemas/productStatsByDay.schema';
import { OrderStatsByDay } from './schemas/orderStatsByDay.schema';

type ProductPopulated = {
  name: { ru: string; en?: string; kg?: string };
  images?: string[];
};

interface TrackSearchImpressionsDto {
  productIds: string[];
  userId?: string;
  sessionId?: string;
  searchQuery?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,

    @InjectModel(ProductStatsByDay.name)
    private productStatsByDayModel: Model<ProductStatsByDay>,

    @InjectModel(OrderStatsByDay.name)
    private orderStatsByDayModel: Model<OrderStatsByDay>,
  ) {}

  async trackEvent(dto: CreateEventDto) {
    await this.eventModel.create(dto);
    return { status: 'ok' };
  }

  async trackSearchImpressions(dto: TrackSearchImpressionsDto) {
    const events = dto.productIds.map((productId) => ({
      type: 'product_search_impression',
      productId: new Types.ObjectId(productId),
      userId: dto.userId ? new Types.ObjectId(dto.userId) : undefined,
      sessionId: dto.sessionId,
      payload: dto.searchQuery ? { searchQuery: dto.searchQuery } : undefined,
      createdAt: new Date(),
    }));

    await this.eventModel.insertMany(events);
    return { status: 'ok', tracked: events.length };
  }

  async getProductMetrics(from: Date, to: Date) {
    const stats = await this.productStatsByDayModel
      .find({
        date: { $gte: from, $lte: to },
      })
      .populate('productId', 'name images')
      .lean();

    return stats.map((item) => {
      const product = item.productId as ProductPopulated | null;

      return {
        productTitle: product?.name.ru ?? 'Удалённый товар',
        image: product?.images?.[0] ?? undefined,
        searchImpressions: item.searchImpressions ?? 0,
        views: item.views ?? 0,
        addToCartQty: item.addToCartQty ?? 0,
        wishlistCount: item.wishlistCount ?? 0,
      };
    });
  }

  async getOrderMetrics(from: Date, to: Date) {
    const items = await this.orderStatsByDayModel
      .find({
        date: {
          $gte: from,
          $lte: to,
        },
      })
      .sort({ date: 1 })
      .lean();

    const totals = items.reduce(
      (acc, item) => {
        acc.ordersCreated += item.ordersCreated ?? 0;
        acc.ordersCanceled += item.ordersCanceled ?? 0;
        acc.ordersPaid += item.ordersPaid ?? 0;
        acc.revenue += item.revenue ?? 0;

        return acc;
      },
      {
        ordersCreated: 0,
        ordersCanceled: 0,
        ordersPaid: 0,
        revenue: 0,
      },
    );

    return {
      items,
      totals,
    };
  }

  async getProductSearchAnalytics(
    from: Date,
    to: Date,
    options?: { limit?: number },
  ) {
    const stats = await this.productStatsByDayModel.aggregate([
      {
        $match: {
          date: { $gte: from, $lte: to },
          searchImpressions: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: '$productId',
          totalSearchImpressions: { $sum: '$searchImpressions' },
          totalViews: { $sum: '$views' },
          totalAddToCart: { $sum: '$addToCart' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          productId: '$_id',
          productTitle: '$product.name.ru',
          image: { $arrayElemAt: ['$product.images', 0] },
          searchImpressions: '$totalSearchImpressions',
          views: '$totalViews',
          addToCart: '$totalAddToCart',
          clickThroughRate: {
            $cond: [
              { $gt: ['$totalSearchImpressions', 0] },
              {
                $multiply: [
                  { $divide: ['$totalViews', '$totalSearchImpressions'] },
                  100,
                ],
              },
              0,
            ],
          },
          conversionRate: {
            $cond: [
              { $gt: ['$totalViews', 0] },
              {
                $multiply: [
                  { $divide: ['$totalAddToCart', '$totalViews'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $sort: { searchImpressions: -1 },
      },
      ...(options?.limit ? [{ $limit: options.limit }] : []),
    ]);

    return stats;
  }
}
