import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

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
}
