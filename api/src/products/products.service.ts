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
import { UpdatePopularStatusDto } from './dto/update-popular-status.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

interface ProductFilter {
  category?: Types.ObjectId;
  colors?: { $in: string[] };
  size?: { $in: string[] };
  price?: { $gte?: number; $lte?: number };
  material?: string;
  inStock?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

type SortOrder = 1 | -1;
interface ProductSort {
  [key: string]: SortOrder;
}

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

    productData.isNew = createProductDto.isNew ?? true;
    productData.createdAt = new Date();

    if (files?.images && files.images.length > 0) {
      productData.images = files.images.map((file) =>
        this.fileUploadService.getPublicPath(file.filename),
      );

      if (createProductDto.imagesByColor) {
        for (const [color, indices] of Object.entries(
          createProductDto.imagesByColor,
        )) {
          const invalidIndices = indices.filter(
            (idx) => idx < 0 || idx >= productData.images!.length,
          );

          if (invalidIndices.length > 0) {
            throw new BadRequestException(
              `Invalid image indices for color "${color}". Indices must be between 0 and ${productData.images!.length - 1}`,
            );
          }
        }

        const productColors = new Set(createProductDto.colors);
        const imageColors = Object.keys(createProductDto.imagesByColor);

        for (const color of imageColors) {
          if (!productColors.has(color)) {
            throw new BadRequestException(
              `Color "${color}" in imagesByColor is not in product colors list`,
            );
          }
        }

        productData.imagesByColor = createProductDto.imagesByColor;
      }
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

  async findPopular(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const filter = { isPopular: true };

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate('category')
        .sort({ createdAt: -1 }),

      this.productModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchProducts(params: {
    query: string;
    limit: number;
    page: number;
    category?: string;
    colors?: string[];
  }) {
    const { query, category, colors, limit, page } = params;

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
      .find(textFilter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .select('_id')
      .lean();

    const regexFilter = {
      ...filter,
      name: { $regex: query, $options: 'i' },
    };

    const regexResults = await this.productModel
      .find(regexFilter)
      .select('_id')
      .lean();

    const idMap = new Map<string, boolean>();

    [...textResults, ...regexResults].forEach((item) => {
      idMap.set(String(item._id as Types.ObjectId), true);
    });

    const productsIds = [...idMap.keys()];

    const totalCount = productsIds.length;

    const skip = (page - 1) * limit;

    const paginatedIds = productsIds.slice(skip, skip + limit);

    const products = await this.productModel
      .find({ _id: { $in: paginatedIds } })
      .lean();

    const productMap = new Map(
      products.map((p) => [String(p._id as Types.ObjectId), p]),
    );

    const orderedProducts = paginatedIds.map((id) => productMap.get(id));

    const totalPages = Math.ceil(totalCount / limit);

    const hasMore = page * limit < totalCount;

    return {
      products: orderedProducts,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore,
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
      images: updateProductDto.images ?? [],
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

      const newImages = files?.images?.map((file) =>
        this.fileUploadService.getPublicPath(file.filename),
      );
      updateData.images = [...(updateData.images || []), ...(newImages || [])];

      if (updateProductDto.imagesByColor) {
        for (const [color, indices] of Object.entries(
          updateProductDto.imagesByColor,
        )) {
          const invalidIndices = indices.filter(
            (idx) => idx < 0 || idx >= updateData.images!.length,
          );

          if (invalidIndices.length > 0) {
            throw new BadRequestException(
              `Invalid image indices for color "${color}". Indices must be between 0 and ${updateData.images!.length - 1}`,
            );
          }
        }

        updateData.imagesByColor = updateProductDto.imagesByColor;
      }
    } else if (updateProductDto.imagesByColor && product.images) {
      for (const [color, indices] of Object.entries(
        updateProductDto.imagesByColor,
      )) {
        const invalidIndices = indices.filter(
          (idx) => idx < 0 || idx >= product.images!.length,
        );

        if (invalidIndices.length > 0) {
          throw new BadRequestException(
            `Invalid image indices for color "${color}". Indices must be between 0 and ${product.images!.length - 1}`,
          );
        }
      }

      updateData.imagesByColor = updateProductDto.imagesByColor;
    }

    if (updateData.imagesByColor) {
      const productColors = new Set(
        updateProductDto.colors || product.colors || [],
      );
      const imageColors = Object.keys(updateData.imagesByColor);

      for (const color of imageColors) {
        if (!productColors.has(color)) {
          throw new BadRequestException(
            `Color "${color}" in imagesByColor is not in product colors list`,
          );
        }
      }
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

  async updateNewStatus(productId: string, isNew: boolean) {
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      { isNew },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    return product;
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
  async updatePopularStatus(
    id: string,
    updatePopularStatus: UpdatePopularStatusDto,
  ) {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.isPopular = updatePopularStatus.isPopular;
    return product.save();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldNewFlags() {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    await this.productModel.updateMany(
      { isNew: true, createdAt: { $lte: threeWeeksAgo } },
      { $set: { isNew: false } },
    );
  }

  async filterProducts(filters: FilterProductsDto) {
    const filter: ProductFilter = {};

    if (filters.categoryId) {
      filter.category = new Types.ObjectId(filters.categoryId);
    }

    if (filters.colors?.length) {
      filter.colors = { $in: filters.colors };
    }

    if (filters.sizes?.length) {
      filter.size = { $in: filters.sizes };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filter.price = {};
      if (filters.minPrice !== undefined) filter.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) filter.price.$lte = filters.maxPrice;
    }

    if (filters.material) {
      filter.material = filters.material;
    }

    if (filters.inStock !== undefined) {
      filter.inStock = filters.inStock;
    }

    if (filters.isNew !== undefined) {
      filter.isNew = filters.isNew;
    }

    if (filters.isPopular !== undefined) {
      filter.isPopular = filters.isPopular;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 16;
    const skip = (page - 1) * limit;

    const sort: ProductSort = {};
    if (filters.sortBy) {
      sort[filters.sortBy] = filters.sortOrder === 'asc' ? 1 : -1;
    }
св
    const [products, totalCount] = await Promise.all([
      this.productModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      products,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore,
      appliedFilters: filters,
    };
  }
}
