import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchQueriesController } from './search-query.controller';
import { SearchQueriesService } from './search-query.service';
import { SearchQuery, SearchQuerySchema } from '../schemas/search-query.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchQuery.name, schema: SearchQuerySchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    AnalyticsModule,
  ],
  controllers: [SearchQueriesController],
  providers: [SearchQueriesService],
  exports: [
    SearchQueriesService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class SearchQueriesModule {}
