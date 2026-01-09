import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { TrackSearchImpressionsDto} from './dto/track-search-impressions.dto';
import {
  getEndOfDay,
  getRangeByPeriod,
  getStartOfDay,
  getYesterdayRange,
} from 'src/utils/date';
import { TokenAuthGuard } from 'src/auth/token-auth.guard';
import { RolesGuard } from 'src/role-auth/role-auth.guard';
import { Roles } from 'src/role-auth/roles.decorator';
import { Role } from 'src/enums/role.enum';

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

  @Post('search-impressions')
  async trackSearchImpressions(@Body() dto: TrackSearchImpressionsDto) {
    return this.analyticsService.trackSearchImpressions(dto);
  }

  @Get('products')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getProductMetrics(
    @Query('period') period?: 'day' | 'week' | 'month' | 'year' | 'all',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    let fromDate: Date;
    let toDate: Date;

    if (period) {
      ({ fromDate, toDate } = getRangeByPeriod(period));
    } else if (from && to) {
      fromDate = getStartOfDay(new Date(from));
      toDate = getEndOfDay(new Date(to));
    } else {
      ({ fromDate, toDate } = getYesterdayRange());
    }

    return this.analyticsService.getProductMetrics(fromDate, toDate);
  }

  @Get('products/search-performance')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getProductSearchAnalytics(
    @Query('period') period?: 'day' | 'week' | 'month' | 'year' | 'all',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
  ) {
    let fromDate: Date;
    let toDate: Date;

    if (period) {
      ({ fromDate, toDate } = getRangeByPeriod(period));
    } else if (from && to) {
      fromDate = getStartOfDay(new Date(from));
      toDate = getEndOfDay(new Date(to));
    } else {
      ({ fromDate, toDate } = getYesterdayRange());
    }

    const limitNum = limit ? parseInt(limit, 10) : undefined;

    return this.analyticsService.getProductSearchAnalytics(fromDate, toDate, {
      limit: limitNum,
    });
  }

  @Get('orders')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getOrdersMetrics(
    @Query('period') period?: 'day' | 'week' | 'month' | 'year' | 'all',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    let fromDate: Date;
    let toDate: Date;

    if (period) {
      ({ fromDate, toDate } = getRangeByPeriod(period));
    } else if (from && to) {
      fromDate = getStartOfDay(new Date(from));
      toDate = getEndOfDay(new Date(to));
    } else {
      ({ fromDate, toDate } = getYesterdayRange());
    }

    return this.analyticsService.getOrderMetrics(fromDate, toDate);
  }
}
