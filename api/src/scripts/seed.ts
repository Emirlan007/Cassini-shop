import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { BannerService } from 'src/banners/banner.service';
import {
  createBannerFixtures,
  createProductFixtures,
  createUserFixtures,
  createCategoryFixtures,
} from '../fixtures';

import { ProductsService } from 'src/products/products.service';
import { Banner } from 'src/schemas/banner.schema';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { UserService } from 'src/users/user.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Types } from 'mongoose';

async function bootstrap() {
  try {
    const appContext = await NestFactory.createApplicationContext(AppModule);

    const userService = appContext.get(UserService);
    const productsService = appContext.get(ProductsService);
    const bannerService = appContext.get(BannerService);
    const categoriesService = appContext.get(CategoriesService);

    const userModel = appContext.get(getModelToken(User.name));
    const productModel = appContext.get(getModelToken(Product.name));
    const bannerModel = appContext.get(getModelToken(Banner.name));
    const categoryModel = appContext.get(getModelToken(Category.name));

    console.log('Clearing existing data...');
    await userModel.deleteMany({});
    await productModel.deleteMany({});
    await bannerModel.deleteMany({});
    await categoryModel.deleteMany({});

    console.log('Creating fixtures...');
    await createUserFixtures(userService);
    const categories = await createCategoryFixtures(categoriesService);
    const typedCategories = categories.map((cat) => ({
      ...cat,
      _id: cat._id as Types.ObjectId,
    })) as (CategoryDocument & { _id: Types.ObjectId })[];

    await createProductFixtures(productsService, typedCategories);

    await createBannerFixtures(bannerService);

    console.log('Fixtures inserted successfully!');
    await appContext.close();
  } catch (error) {
    console.error('Error running fixtures:', error);
    process.exit(1);
  }
}

bootstrap();
