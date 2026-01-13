import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';
import * as timers from 'node:timers';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryDocument> {
    const slug = slugify(dto.title, { lower: true, strict: true });

    const existing = await this.categoryModel.findOne({ slug }).exec();
    if (existing) {
      throw new ConflictException(
        `Category with slug "${slug}" already exists`,
      );
    }

    return this.categoryModel.create({
      ...dto,
      slug,
    });
  }

  async createMany(dtos: CreateCategoryDto[]): Promise<CategoryDocument[]> {
    const categories: CategoryDocument[] = [];

    for (const dto of dtos) {
      const slug =
        dto.slug || slugify(dto.title, { lower: true, strict: true });

      const existing = await this.categoryModel.findOne({ slug }).exec();
      if (!existing) {
        const category = await this.categoryModel.create({
          ...dto,
          slug,
        });
        categories.push(category);
      } else {
        categories.push(existing);
      }
    }

    return categories;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categoryModel.findOne({ slug }).exec();
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDocument> {
    if (dto.title) {
      const slug = slugify(dto.title, { lower: true, strict: true });
      const existing = await this.categoryModel.findOne({ slug }).exec();

      if (existing) {
        throw new ConflictException(
          `Category with slug "${slug}" already exists`,
        );
      }
      dto.slug = slug;
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async delete(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findByIdAndDelete(id).exec();

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    return category;
  }
}
