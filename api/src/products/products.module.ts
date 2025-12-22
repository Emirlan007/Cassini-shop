import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from '../schemas/product.schema';
import { FileUploadModule } from '../shared/file-upload/file-upload.module';
import { SearchQueriesModule } from '../search/search-query.module';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    FileUploadModule,
    SearchQueriesModule,
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [
    ProductsService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class ProductsModule {}
