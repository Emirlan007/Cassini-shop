import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { IsUserExistsValidator } from './validators/is-user-exists.validator';
import { AuthService } from './auth/auth.service';
import { FileUploadModule } from './shared/file-upload/file-upload.module';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

@Module({
  imports: [
    FileUploadModule,
    MongooseModule.forRoot('mongodb://localhost/cassini-shop'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UsersController, ProductsController],
  providers: [IsUserExistsValidator, AuthService, ProductsService],
})
export class AppModule {}
