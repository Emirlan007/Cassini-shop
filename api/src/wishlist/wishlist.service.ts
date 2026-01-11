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
import { localizedField } from 'src/utils/localizedField';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private analyticsService: AnalyticsService,
  ) {}

  async getWishlist(
    userId: string,
    lang: 'ru' | 'en' | 'kg' = 'ru',
  ): Promise<WishlistDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const wishlist = await this.wishlistModel.aggregate([
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'products',
          pipeline: [
            {
              $addFields: {
                name: localizedField('name', lang),
                description: localizedField('description', lang),
                material: localizedField('material', lang),
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
                pipeline: [
                  {
                    $project: {
                      title: localizedField('title', lang),
                      slug: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: '$category',
            },
          ],
        },
      },
    ]);

    if (!wishlist.length) {
      return this.wishlistModel.create({
        userId: new Types.ObjectId(userId),
        products: [],
      });
    }

    return wishlist[0] as WishlistDocument;
  }

  async addProductToWishlist(
    sessionId: string,
    userId: string,
    productId: string,
    lang: 'ru' | 'en' | 'kg' = 'ru',
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

    let wishlist = await this.wishlistModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    const productObjectId = new Types.ObjectId(productId);

    if (!wishlist) {
      wishlist = await this.wishlistModel.create({
        userId: new Types.ObjectId(userId),
        products: [productObjectId],
      });
    } else {
      const exists = wishlist.products.some((id) => id.equals(productObjectId));

      if (exists) {
        throw new BadRequestException('Product already in wishlist');
      }

      wishlist.products.push(productObjectId);
      await wishlist.save();
    }

    const localizedWishlist = await this.wishlistModel.aggregate([
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'products',
          pipeline: [
            {
              $addFields: {
                name: localizedField('name', lang),
                description: localizedField('description', lang),
                material: localizedField('material', lang),
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
                pipeline: [
                  {
                    $project: {
                      title: localizedField('title', lang),
                      slug: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: '$category' },
          ],
        },
      },
    ]);

    await this.analyticsService.trackEvent({
      type: EventType.AddToWishlist,
      sessionId,
      userId: new Types.ObjectId(userId),
      productId: productObjectId,
    });

    return localizedWishlist[0] as WishlistDocument;
  }

  async removeProductFromWishlist(
    userId: string,
    productId: string,
    lang: 'ru' | 'en' | 'kg' = 'ru',
  ): Promise<WishlistDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const wishlist = await this.wishlistModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    const productObjectId = new Types.ObjectId(productId);
    const index = wishlist.products.findIndex((id) =>
      id.equals(productObjectId),
    );

    if (index === -1) {
      throw new NotFoundException('Product not found in wishlist');
    }

    wishlist.products.splice(index, 1);
    await wishlist.save();

    const localizedWishlist = await this.wishlistModel.aggregate([
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'products',
          pipeline: [
            {
              $addFields: {
                name: localizedField('name', lang),
                description: localizedField('description', lang),
                material: localizedField('material', lang),
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
                pipeline: [
                  {
                    $project: {
                      title: localizedField('title', lang),
                      slug: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: '$category' },
          ],
        },
      },
    ]);

    return localizedWishlist[0] as WishlistDocument;
  }
}
