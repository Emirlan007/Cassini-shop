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
import { OrdersController } from './orders/orders.controller';
import { OrderService } from './orders/orders.service';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersModule } from './orders/orders.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { Cart, CartSchema } from './schemas/cart.schema';

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
      { name: Cart.name, schema: CartSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    OrdersModule,
  ],
  controllers: [
    UsersController,
    ProductsController,
    BannersController,
    CategoriesController,
    OrdersController,
    CartController,
  ],
  providers: [
    IsUserExistsValidator,
    AuthService,
    ProductsService,
    UserService,
    BannerService,
    CategoriesService,
    OrderService,
    CartService,
  ],
})
export class AppModule {}
