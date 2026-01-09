import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { SearchQueriesService } from './search-query.service';
import { CreateSearchQueryDto } from './dto/create-search-query.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { SearchQuery } from '../schemas/search-query.schema';
import { AnalyticsService } from '../analytics/analytics.service';

interface SaveQueryResponse {
  success: boolean;
  message?: string;
  data?: SearchQuery;
}

interface SaveSearchWithResultsDto extends CreateSearchQueryDto {
  productIds?: string[];
}

interface SaveSearchWithResultsResponse {
  success: boolean;
  message?: string;
  data?: {
    searchQuery: SearchQuery | null;
    trackedImpressions: number;
  };
}

interface PopularQuery {
  query: string;
  normalizedQuery: string;
  count: number;
  lastSearched: Date;
}

interface SearchStatistic {
  date: string;
  totalSearches: number;
  uniqueQueriesCount: number;
}

@Controller('search-queries')
export class SearchQueriesController {
  constructor(
    private readonly searchQueriesService: SearchQueriesService,
    private readonly analyticsService: AnalyticsService, // Добавьте
  ) {}

  @Post()
  async saveSearchQuery(
    @Body() createSearchQueryDto: CreateSearchQueryDto,
  ): Promise<SaveQueryResponse> {
    const result =
      await this.searchQueriesService.saveSearchQuery(createSearchQueryDto);

    if (!result) {
      return {
        success: false,
        message: 'Query is too short or invalid',
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  @Post('with-results')
  async saveSearchWithResults(
    @Body() dto: SaveSearchWithResultsDto,
  ): Promise<SaveSearchWithResultsResponse> {
    const result = await this.searchQueriesService.saveSearchWithResults(dto);

    if (!result.searchQuery) {
      return {
        success: false,
        message: 'Query is too short or invalid',
      };
    }
    if (dto.productIds && dto.productIds.length > 0) {
      await this.analyticsService.trackSearchImpressions({
        productIds: dto.productIds,
        userId: dto.userId,
        sessionId: dto.sessionId,
        searchQuery: dto.query,
      });
    }

    return {
      success: true,
      data: result,
    };
  }

  @Get('popular')
  async getPopularQueries(
    @Query('limit') limit?: string,
  ): Promise<PopularQuery[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.searchQueriesService.getPopularQueries(limitNum);
  }

  @Get('user/recent')
  @UseGuards(TokenAuthGuard)
  async getUserRecentQueries(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ): Promise<SearchQuery[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.searchQueriesService.getUserRecentQueries(userId, limitNum);
  }

  @Get('statistics')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getSearchStatistics(
    @Query('days') days?: string,
  ): Promise<SearchStatistic[]> {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.searchQueriesService.getSearchStatistics(daysNum);
  }
}
