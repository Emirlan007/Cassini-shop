import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileUploadService } from '../shared/file-upload/file-upload.service';
import { Order, OrderDocument } from '../schemas/order.schema';
import { CreateOrderDto } from './dto/create-order-dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private fileUploadService: FileUploadService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    file: { image: Express.Multer.File },
    userId: string,
  ) {
    if (file.image[0]) {
      createOrderDto.image = this.fileUploadService.getPublicPath(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        file.image[0].filename,
      );
    }

    const createdOrder = new this.orderModel({
      user: userId,
      items: createOrderDto,
      createdAt: new Date().toISOString(),
      totalPrice: createOrderDto.price * createOrderDto.quantity,
    });
    await createdOrder.save();
    return {
      message: 'Order created',
      orderId: createdOrder._id,
    };
  }
}
