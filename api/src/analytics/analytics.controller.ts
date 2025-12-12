import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private analyticsService: AnalyticsService,
  ) {}

  @Post('event')
  async trackEvent(@Body() dto: CreateEventDto) {
    return this.analyticsService.trackEvent(dto);
  }
}
