import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order-dto';
import { type RequestWithUser, TokenAuthGuard } from '../auth/token-auth.guard';
import { OrderService } from './orders.service';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { CommentDto } from './dto/comment.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderHistoryService } from '../order-history/order-history.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrderService,
    private readonly orderHistoryService: OrderHistoryService,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Get('my')
  async getMyOrders(@Req() req: RequestWithUser) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.ordersService.getMyOrders(req.user.id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/orders')
  async getAdminOrders() {
    return this.ordersService.getAdminOrders();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/count-by-status')
  async getOrdersCountByStatus() {
    return this.ordersService.getOrdersCountByStatus();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/count-by-status-today')
  async getOrdersCountByStatusToday() {
    return this.ordersService.getOrdersCountByStatusToday();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  async createOrder(
    @Body() orderData: CreateOrderDto,
    @Req() req: RequestWithUser,
    @Headers('session-id') sessionId: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.ordersService.create(orderData, req.user.id, sessionId);
  }

  @UseGuards(TokenAuthGuard)
  @Post(':id/user-comment')
  async addUserComment(
    @Param('id') orderId: string,
    @Body() commentDto: CommentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ordersService.addUserComment(
      orderId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      req.user.id,
      commentDto.comment,
    );
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post(':id/admin-comment')
  async addAdminComment(
    @Param('id') orderId: string,
    @Body() commentDto: CommentDto,
  ) {
    return this.ordersService.addAdminComment(orderId, commentDto.comment);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/order-status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateOrderStatus(
      orderId,
      updateOrderStatusDto,
    );

    const isReady = await this.ordersService.checkAndAddToHistory(orderId);
    if (isReady) {
      try {
        await this.orderHistoryService.addOrderToHistory(orderId);
      } catch (error) {
        console.log('Order already in history or cannot be added:', error);
      }
    }

    return order;
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/delivery-status')
  async updateDeliveryStatus(
    @Param('id') orderId: string,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ) {
    const order = await this.ordersService.updateDeliveryOrderStatus(
      orderId,
      updateDeliveryStatusDto,
    );
    const isReady = await this.ordersService.checkAndAddToHistory(orderId);
    if (isReady) {
      try {
        await this.orderHistoryService.addOrderToHistory(orderId);
      } catch (error) {
        console.log('Order already in history or cannot be added:', error);
      }
    }

    return order;
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') orderId: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const order = await this.ordersService.updateOrderPaymentStatus(
      orderId,
      updatePaymentStatusDto.paymentStatus,
    );

    const isReady = await this.ordersService.checkAndAddToHistory(orderId);
    if (isReady) {
      try {
        await this.orderHistoryService.addOrderToHistory(orderId);
      } catch (error) {
        console.log('Order already in history or cannot be added:', error);
      }
    }

    return order;
  }
}
