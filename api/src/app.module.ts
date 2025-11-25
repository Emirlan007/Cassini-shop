import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { IsUserExistsValidator } from './validators/is-user-exists.validator';
import { AuthService } from './auth/auth.service';
import { FileUploadModule } from './shared/file-upload/file-upload.module';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { Banner, BannerSchema } from './schemas/banner.schema';
import config from 'config';
import { UserService } from './users/user.service';
import { BannerService } from './banners/banner.service';
import { BannersController } from './banners/banners.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersController } from './orders/orders.contorller';
import { OrderService } from './orders/orders.server';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    FileUploadModule,
    MongooseModule.forRoot(config.db),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    UsersController,
    ProductsController,
    BannersController,
    CategoriesController,
    OrdersController,
  ],
  providers: [
    IsUserExistsValidator,
    AuthService,
    ProductsService,
    UserService,
    BannerService,
    CategoriesService,
    OrderService,
  ],
})
export class AppModule {}
