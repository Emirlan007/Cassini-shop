import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Body,
  Req,
  Headers,
  Query,
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
  async getWishlist(
    @Req() req: RequestWithUser,
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
  ) {
    const userId = req.user.userId || req.user.id || req.user._id;
    return await this.wishlistService.getWishlist(userId as string, lang);
  }

  @Post('add')
  async addProductToWishlist(
    @Req() req: RequestWithUser,
    @Body() addToWishlistDto: AddToWishlistDto,
    @Headers('session-id') sessionId: string,
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
  ) {
    const userId = req.user.userId || req.user.id || req.user._id;
    return this.wishlistService.addProductToWishlist(
      sessionId,
      userId as string,
      addToWishlistDto.productId,
      lang,
    );
  }

  @Delete(':productId')
  async removeProductFromWishlist(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
  ) {
    const userId = req.user.userId || req.user.id || req.user._id;
    return this.wishlistService.removeProductFromWishlist(
      userId as string,
      productId,
      lang,
    );
  }
}
