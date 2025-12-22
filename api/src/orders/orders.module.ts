import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrderService } from './orders.service';
import { Order, OrderSchema } from '../schemas/order.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { FileUploadService } from '../shared/file-upload/file-upload.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Event, EventSchema } from '../analytics/schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrderService, FileUploadService],
  exports: [OrderService],
})
export class OrdersModule {}
