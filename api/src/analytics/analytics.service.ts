import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/analytics/schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,
  ) {}

  async trackEvent(dto: CreateEventDto) {
    await this.eventModel.create(dto);

    return { status: 'ok' };
  }
}
