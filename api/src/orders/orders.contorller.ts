import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order-dto';
import { type RequestWithUser, TokenAuthGuard } from '../auth/token-auth.guard';
import { OrderService } from './orders.server';
import { FileUploadInterceptorOrder } from '../shared/file-upload/file-upload.interceptor';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(TokenAuthGuard)
  @Get('my')
  async getMyOrders(@Req() req: RequestWithUser) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.ordersService.getMyOrders(req.user.id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/orders')
  async getAdminOrders() {
    return this.ordersService.getAdminOrders();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @UseGuards(TokenAuthGuard)
  @UseInterceptors(FileUploadInterceptorOrder)
  @Post()
  async createOrder(
    @Body() orderData: CreateOrderDto[],
    @Req() req: RequestWithUser,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.ordersService.create(orderData, req.user.id);
  }
}
