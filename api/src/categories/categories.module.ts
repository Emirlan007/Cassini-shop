import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from '../schemas/category.schema';
import { FileUploadModule } from '../shared/file-upload/file-upload.module';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../schemas/user.schema';
import { TranslationModule } from '../translation/translation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    FileUploadModule,
    AuthModule,
    TranslationModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [
    CategoriesService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class CategoriesModule {}
