// src/analytics/analytics.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  AnalyticsService,
  ProductMetrics,
  TopSearchedProduct,
} from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';
import { TrackSearchImpressionsDto } from './dto/track-search-impressions.dto';
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

type PeriodType = 'day' | 'week' | 'month' | 'year' | 'all';

interface DateRange {
  fromDate: Date;
  toDate: Date;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * Вспомогательный метод для получения диапазона дат
   */
  private getDateRange(
    period?: PeriodType,
    from?: string,
    to?: string,
  ): DateRange {
    if (period) {
      return getRangeByPeriod(period);
    } else if (from && to) {
      return {
        fromDate: getStartOfDay(new Date(from)),
        toDate: getEndOfDay(new Date(to)),
      };
    } else {
      return getYesterdayRange();
    }
  }

  @Post('event')
  async trackEvent(@Body() dto: CreateEventDto) {
    return this.analyticsService.trackEvent(dto);
  }

  /**
   * Трекинг показов товаров в результатах поиска
   * POST /analytics/search-impressions
   * Body: { productIds: string[], userId?: string, sessionId?: string, searchQuery?: string }
   */
  @Post('search-impressions')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async trackSearchImpressions(@Body() dto: TrackSearchImpressionsDto) {
    return this.analyticsService.trackSearchImpressions(dto);
  }

  @Get('products')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getProductMetrics(
    @Query('period') period?: PeriodType,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<ProductMetrics[]> {
    const { fromDate, toDate } = this.getDateRange(period, from, to);
    return this.analyticsService.getProductMetrics(fromDate, toDate);
  }

  /**
   * Получить топ товаров по показам в поиске
   * GET /analytics/products/top-searched?period=week&limit=20
   */
  @Get('products/top-searched')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getTopSearchedProducts(
    @Query('period') period?: PeriodType,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
  ): Promise<TopSearchedProduct[]> {
    const { fromDate, toDate } = this.getDateRange(period, from, to);
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.analyticsService.getTopSearchedProducts(
      fromDate,
      toDate,
      limitNum,
    );
  }

  @Get('orders')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getOrdersMetrics(
    @Query('period') period?: PeriodType,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { fromDate, toDate } = this.getDateRange(period, from, to);
    return this.analyticsService.getOrderMetrics(fromDate, toDate);
  }
}
