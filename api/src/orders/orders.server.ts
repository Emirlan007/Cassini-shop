import { Injectable } from '@nestjs/common';
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

  async getMyOrders(userId: string) {
    return this.orderModel.find({ user: userId });
  }

  async getAdminOrders() {
    return this.orderModel
      .find()
      .populate('user', 'displayName phoneNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(createOrderDto: CreateOrderDto[], userId: string) {
    const totalPrice = createOrderDto.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const createdOrder = new this.orderModel({
      user: userId,
      items: createOrderDto,
      createdAt: new Date().toISOString(),
      totalPrice: totalPrice,
    });

    await createdOrder.save();

    return {
      message: 'Order created',
      orderId: createdOrder._id,
    };
  }
}
