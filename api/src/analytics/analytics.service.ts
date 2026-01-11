// src/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from 'src/analytics/schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { TrackSearchImpressionsDto } from './dto/track-search-impressions.dto';
import { ProductStatsByDay } from './schemas/productStatsByDay.schema';
import { OrderStatsByDay } from './schemas/orderStatsByDay.schema';
import { EventType } from 'src/enums/event.enum';

type ProductPopulated = {
  _id: Types.ObjectId;
  name: { ru: string; en?: string; kg?: string };
  images?: string[];
};

type ProductStatsByDayLean = {
  _id: Types.ObjectId;
  productId: Types.ObjectId | ProductPopulated;
  date: Date;
  searchImpressions: number;
  views: number;
  addToCart: number;
  addToCartQty: number;
  wishlistCount: number;
  ordersCount: number;
  paidCount: number;
  refundCount: number;
};

export interface ProductMetrics {
  productTitle: string;
  image?: string;
  searchImpressions: number;
  views: number;
  addToCartQty: number;
  wishlistCount: number;
}

interface GroupedMetrics {
  [productId: string]: ProductMetrics;
}

export interface TopSearchedProduct {
  productTitle: string;
  image?: string;
  searchImpressions: number;
  views: number;
  addToCart: number;
  conversionRate: number;
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

  /**
   * Массовый трекинг показов товаров в результатах поиска
   * Эффективен для обработки множества товаров за один запрос
   */
  async trackSearchImpressions(dto: TrackSearchImpressionsDto) {
    if (!dto.productIds || dto.productIds.length === 0) {
      return { status: 'ok', tracked: 0 };
    }

    // Фильтруем только валидные ObjectId
    const validProductIds = dto.productIds.filter((id) =>
      Types.ObjectId.isValid(id),
    );

    if (validProductIds.length === 0) {
      return { status: 'ok', tracked: 0 };
    }

    // Создаем события для каждого товара
    const events = validProductIds.map((productId) => ({
      type: EventType.SEARCH_IMPRESSION,
      productId: new Types.ObjectId(productId),
      userId: dto.userId ? new Types.ObjectId(dto.userId) : undefined,
      sessionId: dto.sessionId,
      payload: dto.searchQuery ? { searchQuery: dto.searchQuery } : undefined,
      createdAt: new Date(),
    }));

    await this.eventModel.insertMany(events, { ordered: false });

    return {
      status: 'ok',
      tracked: validProductIds.length,
    };
  }

  async getProductMetrics(from: Date, to: Date): Promise<ProductMetrics[]> {
    const stats = await this.productStatsByDayModel
      .find({
        date: { $gte: from, $lte: to },
      })
      .populate<{ productId: ProductPopulated }>('productId', 'name images')
      .lean<ProductStatsByDayLean[]>();

    // Группируем по товару и суммируем метрики
    const grouped = stats.reduce<GroupedMetrics>((acc, item) => {
      // Type guard для проверки, является ли productId объектом (populated) или просто ObjectId
      const isPopulated = (
        productId: Types.ObjectId | ProductPopulated,
      ): productId is ProductPopulated => {
        return typeof productId === 'object' && '_id' in productId;
      };

      const productId = isPopulated(item.productId)
        ? item.productId._id.toString()
        : item.productId.toString();

      if (!acc[productId]) {
        const product = isPopulated(item.productId) ? item.productId : null;
        acc[productId] = {
          productTitle: product?.name.ru ?? 'Удалённый товар',
          image: product?.images?.[0],
          searchImpressions: 0,
          views: 0,
          addToCartQty: 0,
          wishlistCount: 0,
        };
      }

      acc[productId].searchImpressions += item.searchImpressions ?? 0;
      acc[productId].views += item.views ?? 0;
      acc[productId].addToCartQty += item.addToCartQty ?? 0;
      acc[productId].wishlistCount += item.wishlistCount ?? 0;

      return acc;
    }, {});

    return Object.values(grouped);
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

  /**
   * Получить топ товаров по показам в поиске
   */
  async getTopSearchedProducts(
    from: Date,
    to: Date,
    limit: number = 10,
  ): Promise<TopSearchedProduct[]> {
    interface AggregationResult {
      _id: Types.ObjectId;
      totalSearchImpressions: number;
      totalViews: number;
      totalAddToCart: number;
      product?: {
        name: { ru: string; en?: string; kg?: string };
        images?: string[];
      };
    }

    const stats = await this.productStatsByDayModel
      .aggregate<AggregationResult>([
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
            totalAddToCart: { $sum: '$addToCartQty' },
          },
        },
        {
          $sort: { totalSearchImpressions: -1 },
        },
        {
          $limit: limit,
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
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            totalSearchImpressions: 1,
            totalViews: 1,
            totalAddToCart: 1,
            product: {
              name: 1,
              images: 1,
            },
          },
        },
      ])
      .exec();

    const result: TopSearchedProduct[] = stats.map((item) => ({
      productTitle: item.product?.name?.ru ?? 'Удалённый товар',
      image: item.product?.images?.[0],
      searchImpressions: item.totalSearchImpressions,
      views: item.totalViews,
      addToCart: item.totalAddToCart,
      conversionRate:
        item.totalSearchImpressions > 0
          ? (item.totalViews / item.totalSearchImpressions) * 100
          : 0,
    }));

    return result;
  }
}
