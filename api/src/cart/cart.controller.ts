import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(
    @Headers('authorization') token?: string,
    @Headers('session-id') sessionId?: string,
  ) {
    return this.cartService.getCart(token, sessionId);
  }

  @Post('add')
  async addItem(
    @Body() dto: CartItemDto,
    @Headers('authorization') token?: string,
    @Headers('session-id') sessionId?: string,
  ) {
    return this.cartService.addItem(dto, token, sessionId);
  }

  @Patch('updateQuantity')
  async updateItemQuantity(
    @Body() dto: CartItemDto,
    @Headers('authorization') token?: string,
    @Headers('session-id') sessionId?: string,
  ) {
    return this.cartService.updateQuantity(dto, token, sessionId);
  }

  @Patch('removeItem')
  async removeItem(
    @Body() dto: CartItemDto,
    @Headers('authorization') token?: string,
    @Headers('session-id') sessionId?: string,
  ) {
    return this.cartService.removeItem(dto, token, sessionId);
  }

  @Delete()
  async delete(
    @Headers('authorization') token?: string,
    @Headers('session-id') sessionId?: string,
  ) {
    return this.cartService.delete(token, sessionId);
  }
}
