import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { RequestWithUser } from '../auth/token-auth.guard';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { OrderHistoryService } from './order-history.service';
import type { Types } from 'mongoose';

@Controller('order-history')
export class OrderHistoryController {
  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  @UseGuards(TokenAuthGuard)
  @Get('my')
  async getMyOrderHistory(@Req() req: RequestWithUser) {
    const userId = (req.user._id as Types.ObjectId).toString();
    return this.orderHistoryService.getUserOrderHistory(userId);
  }

  @UseGuards(TokenAuthGuard)
  @Get('my/stats')
  async getMyOrderStats(@Req() req: RequestWithUser) {
    const userId = (req.user._id as Types.ObjectId).toString();
    return this.orderHistoryService.getUserOrderHistoryStats(userId);
  }

  @UseGuards(TokenAuthGuard)
  @Get(':id')
  async getOrderHistoryById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.orderHistoryService.getOrderHistoryById(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('add/:orderId')
  async addOrderToHistory(
    @Param('orderId', ParseObjectIdPipe) orderId: string,
  ) {
    return this.orderHistoryService.addOrderToHistory(orderId);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/all')
  async getAllOrderHistory() {
    return this.orderHistoryService.getAllOrderHistory();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/user/:userId')
  async getUserOrderHistory(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ) {
    return this.orderHistoryService.getUserOrderHistory(userId);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/user/:userId/stats')
  async getUserOrderStats(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.orderHistoryService.getUserOrderHistoryStats(userId);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('admin/:id')
  async deleteOrderHistory(@Param('id', ParseObjectIdPipe) id: string) {
    return this.orderHistoryService.deleteOrderHistory(id);
  }
}
