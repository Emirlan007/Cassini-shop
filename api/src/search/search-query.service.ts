import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SearchQuery,
  SearchQueryDocument,
} from '../schemas/search-query.schema';
import { CreateSearchQueryDto } from './dto/create-search-query.dto';
import { SaveSearchWithResultsDto } from './dto/safe-search-with-result.dto';

@Injectable()
export class SearchQueriesService {
  constructor(
    @InjectModel(SearchQuery.name)
    private searchQueryModel: Model<SearchQueryDocument>,
  ) {}

  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  private isValidQuery(query: string): boolean {
    const normalized = this.normalizeQuery(query);
    return normalized.length >= 2;
  }

  async saveSearchQuery(
    createSearchQueryDto: CreateSearchQueryDto,
  ): Promise<SearchQuery | null> {
    const { query, userId, sessionId } = createSearchQueryDto;

    if (!this.isValidQuery(query)) {
      return null;
    }

    const normalizedQuery = this.normalizeQuery(query);

    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const recentQuery = await this.searchQueryModel.findOne({
      normalizedQuery,
      ...(sessionId ? { sessionId } : {}),
      ...(userId && Types.ObjectId.isValid(userId)
        ? { userId: new Types.ObjectId(userId) }
        : {}),
      createdAt: { $gte: fiveSecondsAgo },
    });

    if (recentQuery) {
      return recentQuery;
    }

    const searchQueryData: Partial<SearchQuery> = {
      query,
      normalizedQuery,
      createdAt: new Date(),
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      searchQueryData.userId = new Types.ObjectId(userId);
    }

    if (sessionId) {
      searchQueryData.sessionId = sessionId;
    }

    const searchQuery = new this.searchQueryModel(searchQueryData);
    return searchQuery.save();
  }

  async saveSearchWithResults(dto: SaveSearchWithResultsDto): Promise<{
    searchQuery: SearchQuery | null;
    trackedImpressions: number;
  }> {
    const searchQuery = await this.saveSearchQuery({
      query: dto.query,
      userId: dto.userId,
      sessionId: dto.sessionId,
    });
    return {
      searchQuery,
      trackedImpressions: dto.productIds?.length || 0,
    };
  }

  async getPopularQueries(limit: number = 10): Promise<
    Array<{
      query: string;
      normalizedQuery: string;
      count: number;
      lastSearched: Date;
    }>
  > {
    return this.searchQueryModel.aggregate([
      {
        $group: {
          _id: '$normalizedQuery',
          count: { $sum: 1 },
          lastSearched: { $max: '$createdAt' },
          originalQuery: { $first: '$query' },
        },
      },
      {
        $sort: { count: -1, lastSearched: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          query: '$originalQuery',
          normalizedQuery: '$_id',
          count: 1,
          lastSearched: 1,
        },
      },
    ]);
  }

  async getUserRecentQueries(
    userId: string,
    limit: number = 10,
  ): Promise<SearchQuery[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }

    return this.searchQueryModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getSearchStatistics(days: number = 7): Promise<
    Array<{
      date: string;
      totalSearches: number;
      uniqueQueriesCount: number;
    }>
  > {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.searchQueryModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalSearches: { $sum: 1 },
          uniqueQueries: { $addToSet: '$normalizedQuery' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalSearches: 1,
          uniqueQueriesCount: { $size: '$uniqueQueries' },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
  }
}
