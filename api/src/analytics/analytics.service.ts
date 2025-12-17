import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/analytics/schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { ProductStatsByDay } from './schemas/productStatsByDay.schema';
import { OrderStatsByDay } from './schemas/orderStatsByDay.schema';

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
}
