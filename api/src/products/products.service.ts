import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUploadService } from '../shared/file-upload/file-upload.service';
import { promises as fs } from 'fs';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private fileUploadService: FileUploadService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: { images?: Express.Multer.File[]; video?: Express.Multer.File[] },
  ): Promise<Product> {
    const { category, ...restDto } = createProductDto;

    const productData: Omit<Partial<Product>, 'category'> & {
      category?: Types.ObjectId;
    } = {
      ...restDto,
    };

    if (category) {
      productData.category = this.validateAndConvertCategory(category);
    }

    if (files?.images && files.images.length > 0) {
      productData.images = files.images.map((file) =>
        this.fileUploadService.getPublicPath(file.filename),
      );
    }

    if (files?.video?.[0]) {
      productData.video = this.fileUploadService.getPublicPath(
        files.video[0].filename,
      );
    }

    const createdProduct = new this.productModel(productData);
    return createdProduct.save();
  }

  async createMany(dataArray: CreateProductDto[]): Promise<Product[]> {
    const products: Product[] = [];
    for (const data of dataArray) {
      const product = await this.create(data);
      products.push(product);
    }
    return products;
  }

  async findAll(categoryId?: string): Promise<Product[]> {
    const query = this.productModel.find();
    if (categoryId) {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new BadRequestException(`Invalid category ID: ${categoryId}`);
      }
      query.where('category').equals(new Types.ObjectId(categoryId));
    }
    return query.populate('category', 'title slug').exec();
  }

  async findBySearch(searchValue?: string): Promise<Product[]> {
    const query = this.productModel.find();
    if (searchValue) {
      query.find({
        name: { $regex: searchValue, $options: 'i' },
      });
    }
    return query.populate('category', 'title slug').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category', 'title slug')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async searchProducts(params: {
    query: string;
    category?: string;
    colors?: string[];
    limit?: number;
  }) {
    const { query, category, colors, limit = 20 } = params;

    const filter: FilterQuery<ProductDocument> = {};

    if (category && Types.ObjectId.isValid(category)) {
      filter.category = new Types.ObjectId(category);
    }

    if (colors?.length) {
      filter.colors = { $in: colors };
    }

    const textFilter = {
      ...filter,
      $text: { $search: query },
    };

    const textResults = await this.productModel
      .find(textFilter, {
        score: { $meta: 'textScore' },
      })
      .sort({
        score: { $meta: 'textScore' },
      })
      .limit(limit)
      .lean();

    const regexFilter = {
      ...filter,
      name: { $regex: query, $options: 'i' },
    };

    const regexResults = await this.productModel
      .find(regexFilter)
      .limit(limit)
      .lean();

    const map = new Map<string, any>();

    for (const item of [...textResults, ...regexResults]) {
      map.set((item._id as Types.ObjectId).toString(), item);
    }

    const products = [...map.values()].slice(0, limit) as Product[];

    return {
      products,
      totalCount: products.length,
      searchQuery: query,
    };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: { images?: Express.Multer.File[]; video?: Express.Multer.File[] },
  ): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { category, ...restDto } = updateProductDto;

    const updateData: Omit<Partial<Product>, 'category'> & {
      category?: Types.ObjectId;
    } = {
      ...restDto,
    };

    if (category) {
      updateData.category = this.validateAndConvertCategory(category);
    }

    if (files?.images && files.images.length > 0) {
      if (product.images && product.images.length > 0) {
        for (const imagePath of product.images) {
          try {
            const filename = imagePath.split('/').pop();
            if (filename) {
              const filePath = this.fileUploadService.getFilePath(filename);
              await fs.unlink(filePath);
            }
          } catch (error) {
            console.error('Error deleting old image file:', error);
          }
        }
      }
      updateData.images = files.images.map((file) =>
        this.fileUploadService.getPublicPath(file.filename),
      );
    }

    if (files?.video?.[0]) {
      if (product.video) {
        try {
          const oldFilename = product.video.split('/').pop();
          if (oldFilename) {
            const oldFilePath = this.fileUploadService.getFilePath(oldFilename);
            await fs.unlink(oldFilePath);
          }
        } catch (error) {
          console.error('Error deleting old video file:', error);
        }
      }

      updateData.video = this.fileUploadService.getPublicPath(
        files.video[0].filename,
      );
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'title slug')
      .exec();

    return updatedProduct!;
  }

  async updateDiscount(productId: string, updateData: UpdateDiscountDto) {
    const { discount, discountUntil } = updateData;

    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (discount !== undefined) {
      product.discount = discount;
    }

    if (discountUntil !== undefined) {
      product.discountUntil = new Date(discountUntil);
    }

    return product.save();
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.images && product.images.length > 0) {
      for (const imagePath of product.images) {
        try {
          const filename = imagePath.split('/').pop();
          if (filename) {
            const filePath = this.fileUploadService.getFilePath(filename);
            await fs.unlink(filePath);
          }
        } catch (error) {
          console.error('Error deleting image file:', error);
        }
      }
    }

    if (product.video) {
      try {
        const filename = product.video.split('/').pop();
        if (filename) {
          const filePath = this.fileUploadService.getFilePath(filename);
          await fs.unlink(filePath);
        }
      } catch (error) {
        console.error('Error deleting video file:', error);
      }
    }

    await this.productModel.findByIdAndDelete(id).exec();
  }
  private validateAndConvertCategories(categories: string[]): Types.ObjectId[] {
    return categories.map((id) => {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid category ID: ${id}`);
      }
      return new Types.ObjectId(id);
    });
  }

  private validateAndConvertCategory(categoryId: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException(`Invalid category ID: ${categoryId}`);
    }
    return new Types.ObjectId(categoryId);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async removeExpiredDiscounts() {
    const now = new Date();

    await this.productModel.updateMany(
      {
        discount: { $ne: null },
        discountUntil: { $lt: now },
      },
      {
        $set: {
          discount: null,
          discountUntil: null,
        },
      },
    );
  }
}
