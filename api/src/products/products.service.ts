import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUploadService } from '../shared/file-upload/file-upload.service';
import { promises as fs } from 'fs';

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
    const productData: Partial<Product> = { ...createProductDto };

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

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
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

    const updateData: Partial<Product> = { ...updateProductDto };

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
      .exec();

    return updatedProduct!;
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
}
