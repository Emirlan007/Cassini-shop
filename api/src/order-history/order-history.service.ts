import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderHistory,
  OrderHistoryDocument,
} from '../schemas/order-history.schema';
import { Order, OrderDocument } from '../schemas/order.schema';
import { DeliveryStatus, OrderStatus } from '../enums/order.enum';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectModel(OrderHistory.name)
    private readonly orderHistoryModel: Model<OrderHistoryDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async addOrderToHistory(orderId: string) {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.deliveryStatus !== DeliveryStatus.Delivered) {
      throw new BadRequestException(
        'Order cannot be added to history: delivery status must be "delivered"',
      );
    }

    if (order.status !== OrderStatus.Completed) {
      throw new BadRequestException(
        'Order cannot be added to history: order status must be "completed"',
      );
    }

    const existingHistory = await this.orderHistoryModel
      .findOne({ order: orderId })
      .exec();

    if (existingHistory) {
      throw new BadRequestException(
        'This order has already been added to history',
      );
    }

    const orderHistory = new this.orderHistoryModel({
      user: order.user,
      order: orderId,
      items: order.items,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      completedAt: new Date(),
    });

    await orderHistory.save();

    return {
      message: 'Order successfully added to history',
      historyId: orderHistory._id,
    };
  }

  async getUserOrderHistory(userId: string) {
    const history = await this.orderHistoryModel
      .find({ user: userId })
      .populate('order')
      .populate('items.product', 'title description')
      .sort({ completedAt: -1 })
      .exec();

    return history;
  }

  async getOrderHistoryById(historyId: string) {
    const history = await this.orderHistoryModel
      .findById(historyId)
      .populate('user', 'name email phoneNumber')
      .populate('order')
      .populate('items.product', 'title description category')
      .exec();

    if (!history) {
      throw new NotFoundException(
        `Order history with ID ${historyId} not found`,
      );
    }

    return history;
  }

  async getAllOrderHistory() {
    return this.orderHistoryModel
      .find()
      .populate('user', 'name email phoneNumber')
      .populate('order')
      .sort({ completedAt: -1 })
      .exec();
  }

  async getUserOrderHistoryStats(userId: string) {
    const history = await this.orderHistoryModel.find({ user: userId }).exec();

    const totalOrders = history.length;
    const totalSpent = history.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    const productsPurchased = history.reduce((sum, order) => {
      return sum + order.items.reduce((s, item) => s + item.quantity, 0);
    }, 0);

    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      totalSpent,
      productsPurchased,
      averageOrderValue,
    };
  }

  async deleteOrderHistory(historyId: string) {
    const history = await this.orderHistoryModel.findByIdAndDelete(historyId);

    if (!history) {
      throw new NotFoundException(
        `Order history with ID ${historyId} not found`,
      );
    }

    return {
      message: 'Order history deleted successfully',
    };
  }
}
