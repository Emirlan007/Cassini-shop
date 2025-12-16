import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/analytics/schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { ProductStatsByDay } from './schemas/productStatsByDay.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,

    @InjectModel(ProductStatsByDay.name)
    private productStatsByDayModel: Model<ProductStatsByDay>,
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
}
