import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Body,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import type { RequestWithUser } from '../interfaces/request-with-user.interface';

@Controller('wishlist')
@UseGuards(TokenAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Req() req: RequestWithUser) {
    const userId = req.user.userId || req.user.id || req.user._id;
    return this.wishlistService.getWishlist(userId as string);
  }

  @Post('add')
  async addProductToWishlist(
    @Req() req: RequestWithUser,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    const userId = req.user.userId || req.user.id || req.user._id;
    return this.wishlistService.addProductToWishlist(
      userId as string,
      addToWishlistDto.productId,
    );
  }

  @Delete(':productId')
  async removeProductFromWishlist(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    const userId = req.user.userId || req.user.id || req.user._id;
    return this.wishlistService.removeProductFromWishlist(
      userId as string,
      productId,
    );
  }
}
