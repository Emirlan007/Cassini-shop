import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from '../schemas/wishlist.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { EventType } from 'src/enums/event.enum';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private analyticsService: AnalyticsService,
  ) {}

  async getWishlist(userId: string): Promise<WishlistDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    let wishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'products',
        populate: {
          path: 'category',
          select: 'title slug',
        },
      })
      .exec();

    if (!wishlist) {
      wishlist = await this.wishlistModel.create({
        userId: new Types.ObjectId(userId),
        products: [],
      });
    }

    return wishlist;
  }

  async addProductToWishlist(
    sessionId: string,
    userId: string,
    productId: string,
  ): Promise<WishlistDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    let wishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!wishlist) {
      wishlist = await this.wishlistModel.create({
        userId: new Types.ObjectId(userId),
        products: [new Types.ObjectId(productId)],
      });
    } else {
      const productObjectId = new Types.ObjectId(productId);
      const productExists = wishlist.products.some((id) =>
        id.equals(productObjectId),
      );

      if (productExists) {
        throw new BadRequestException('Product already in wishlist');
      }

      wishlist.products.push(productObjectId);
      await wishlist.save();
    }

    const updatedWishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'products',
        populate: {
          path: 'category',
          select: 'title slug',
        },
      })
      .exec();

    if (!updatedWishlist) {
      throw new NotFoundException('Wishlist not found after update');
    }

    await this.analyticsService.trackEvent({
      type: EventType.AddToWishlist,
      sessionId,
      userId,
      productId,
    });

    return updatedWishlist;
  }

  async removeProductFromWishlist(
    userId: string,
    productId: string,
  ): Promise<WishlistDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const wishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    const productObjectId = new Types.ObjectId(productId);
    const productIndex = wishlist.products.findIndex((id) =>
      id.equals(productObjectId),
    );

    if (productIndex === -1) {
      throw new NotFoundException('Product not found in wishlist');
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    const updatedWishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'products',
        populate: {
          path: 'category',
          select: 'title slug',
        },
      })
      .exec();

    if (!updatedWishlist) {
      throw new NotFoundException('Wishlist not found after removal');
    }

    return updatedWishlist;
  }
}
