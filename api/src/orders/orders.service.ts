import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileUploadService } from '../shared/file-upload/file-upload.service';
import { Order, OrderDocument } from '../schemas/order.schema';
import { CreateOrderDto } from './dto/create-order-dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { OrderStatus } from '../enums/order.enum';
import { Event, EventDocument } from 'src/analytics/schemas/event.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    private fileUploadService: FileUploadService,
  ) {}

  async getMyOrders(userId: string) {
    return this.orderModel.find({ user: userId });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name phoneNumber')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getAdminOrders() {
    return this.orderModel
      .find()
      .populate('user', 'name phoneNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUserOrders(userId: string) {
    const orders = await this.orderModel
      .find({ user: userId })
      .populate('user', 'email name')
      .sort({ createdAt: -1 })
      .exec();

    if (!orders) {
      throw new NotFoundException(
        `Orders for user with ID ${userId} not found`,
      );
    }

    return orders;
  }

  async updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: 'pending' | 'paid' | 'cancelled',
  ) {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          paymentStatus,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
    sessionId: string,
  ) {
    const { items, paymentMethod, status, userComment } = createOrderDto;

    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await this.productModel.findById(item.product).lean();

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.product} not found`,
          );
        }

        const finalPrice = this.calculateFinalPrice(product);

        return {
          product: item.product,
          title: item.title,
          image: item.image,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: item.price,
          finalPrice,
          quantity: item.quantity,
        };
      }),
    );

    const calculatedTotalPrice = processedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const createdOrder = new this.orderModel({
      user: userId,
      items: processedItems,
      paymentMethod,
      status: status ?? OrderStatus.Pending,
      paymentStatus: 'pending',
      userComment: userComment ?? null,
      adminComments: [],
      createdAt: new Date(),
      totalPrice: calculatedTotalPrice,
    });

    await createdOrder.save();

    await this.eventModel.create({
      type: 'order_created',
      userId,
      sessionId,
      orderId: createdOrder._id,
    });

    return {
      message: 'Order created',
      orderId: createdOrder._id,
    };
  }

  private calculateFinalPrice(product: Product): number {
    const now = new Date();

    if (
      product.discount &&
      product.discountUntil &&
      product.discountUntil < now
    ) {
      return product.price;
    }

    if (product.discount) {
      return Math.round(product.price * (1 - product.discount / 100));
    }

    return product.price;
  }

  async addUserComment(orderId: string, userId: string, comment: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderUserId =
      typeof order.user === 'string' ? order.user : order.user.toString();

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

  async updateDeliveryOrderStatus(
    orderId: string,
    updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ) {
    const { deliveryStatus } = updateDeliveryStatusDto;

    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          deliveryStatus,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }
}
