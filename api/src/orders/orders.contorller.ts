import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order-dto';
import { type RequestWithUser, TokenAuthGuard } from '../auth/token-auth.guard';
import { OrderService } from './orders.server';
import { FileUploadInterceptorOrder } from '../shared/file-upload/file-upload.interceptor';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(TokenAuthGuard)
  @Get('my')
  async getMyOrders(@Req() req: RequestWithUser) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.ordersService.getMyOrders(req.user.id);
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
