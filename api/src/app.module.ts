import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import config from 'config';

import { ValidationModule } from './validators/validation.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './shared/file-upload/file-upload.module';

import { UsersModule } from './users/user.module';
import { ProductsModule } from './products/products.module';
import { BannersModule } from './banners/banner.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { SearchQueriesModule } from './search/search-query.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(config.db),
    ScheduleModule.forRoot(),

    ValidationModule,
    AuthModule,
    FileUploadModule,

    UsersModule,
    ProductsModule,
    BannersModule,
    CategoriesModule,
    OrdersModule,
    CartModule,
    WishlistModule,
    SearchQueriesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
