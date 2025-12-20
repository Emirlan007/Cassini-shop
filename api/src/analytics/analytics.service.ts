import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/analytics/schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { ProductStatsByDay } from './schemas/productStatsByDay.schema';
import { OrderStatsByDay } from './schemas/orderStatsByDay.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventType } from 'src/enums/event.enum';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

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

    if (dto.type === EventType.AddToCart && dto.productId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await this.productStatsByDayModel.findOneAndUpdate(
        {
          productId: dto.productId,
          date: today,
        },
        {
          $inc: {
            addToCart: 1,
            addToCartQty: dto.qty || 1,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );
    }

    return { status: 'ok' };
  }

  async getProductMetrics(from: Date, to: Date) {
    return this.productStatsByDayModel
      .find({
        date: {
          $gte: from,
          $lte: to,
        },
      })
      .sort({ date: 1 })
      .lean();
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
        acc.ordersCompleted += item.ordersCompleted ?? 0;
        acc.revenue += item.revenue ?? 0;

        return acc;
      },
      {
        ordersCreated: 0,
        ordersCanceled: 0,
        ordersCompleted: 0,
        revenue: 0,
      },
    );

    return {
      items,
      totals,
    };
  }

  ///Aggregation starts EveryDayAt_1_AM
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async aggregateAddToCartStats() {
    this.logger.log('Starting add_to_cart aggregation...');
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      const aggregation = await this.eventModel.aggregate([
        {
          $match: {
            type: EventType.AddToCart,
            createdAt: {
              $gte: yesterday,
              $lte: endOfYesterday,
            },
            productId: { $exists: true },
          },
        },
        {
          $group: {
            _id: '$productId',
            addToCartCount: { $sum: 1 },
            addToCartQty: { $sum: { $ifNull: ['$qty', 1] } },
          },
        },
      ]);

      this.logger.log(
        `Found ${aggregation.length} products with add_to_cart events`,
      );

      for (const item of aggregation) {
        await this.productStatsByDayModel.findOneAndUpdate(
          {
            productId: item._id,
            date: yesterday,
          },
          {
            $inc: {
              addToCart: item.addToCartCount,
              addToCartQty: item.addToCartQty,
            },
          },
          {
            upsert: true, // Создать, если не существует
            new: true,
          },
        );
      }

      this.logger.log('Add_to_cart aggregation completed successfully');
    } catch (error) {
      this.logger.error('Error during add_to_cart aggregation:', error);
      throw error;
    }
  }
}
