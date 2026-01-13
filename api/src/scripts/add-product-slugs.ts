import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import { generateSlug } from '../utils/slug';

import { Model } from 'mongoose';
import { ProductDocument } from '../schemas/product.schema';

async function addSlugsToProducts() {
  console.log('Starting migration: Adding slugs to existing products...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);
  const productModel = app.get<Model<ProductDocument>>('ProductModel');

  try {
    const products = await productModel.find().lean().exec();
    console.log(`Found ${products.length} products to update`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      if (product.slug) {
        skipped++;
        continue;
      }

      try {
        const baseSlug = generateSlug(product.name.ru);
        await productsService.update(
          String(product._id),
          { name: product.name },
          undefined,
        );

        updated++;
        console.log(
          `✓ Updated product "${product.name.ru}" with slug: ${baseSlug}`,
        );
      } catch (error) {
        console.error(`✗ Error updating product "${product.name.ru}":`, error);
      }
    }

    console.log('\nMigration completed!');
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total: ${products.length}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

addSlugsToProducts();
