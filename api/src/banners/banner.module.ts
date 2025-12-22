import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersController } from './banners.controller';
import { BannerService } from './banner.service';
import { Banner, BannerSchema } from '../schemas/banner.schema';
import { FileUploadModule } from '../shared/file-upload/file-upload.module';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    FileUploadModule,
    AuthModule,
  ],
  controllers: [BannersController],
  providers: [BannerService],
  exports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class BannersModule {}
