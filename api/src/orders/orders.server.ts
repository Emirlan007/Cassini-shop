import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'displayName phoneNumber')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getAdminOrders() {
    return this.orderModel
      .find()
      .populate('user', 'displayName phoneNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUserOrders(userId: string) {
    const orders = await this.orderModel
      .find({ user: userId })
      .populate('user', 'email name')
      .sort({ createdAt: -1 })
      .exec();

    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        `Orders for user with ID ${userId} not found`,
      );
    }

    return orders;
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { items, paymentMethod, status, userComment, totalPrice } =
      createOrderDto;

    const createdOrder = new this.orderModel({
      user: userId,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      paymentMethod,
      status: status ?? 'pending',
      userComment: userComment ?? null,
      adminComments: [],
      createdAt: new Date(),
      totalPrice,
    });

    await createdOrder.save();

    return {
      message: 'Order created',
      orderId: createdOrder._id,
    };
  }

  async addUserComment(orderId: string, userId: string, comment: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderUserId =
      typeof order.user === 'string'
        ? order.user
        : (order.user as Types.ObjectId).toString();

    if (orderUserId !== userId) {
      throw new ForbiddenException('You can comment only your own orders');
    }

    if (order.userComment) {
      return order;
    }

    order.userComment = comment;

    await order.save();
    return order;
  }

  async addAdminComment(orderId: string, comment: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.adminComments.push(comment);

    await order.save();
    return order;
  }
}
