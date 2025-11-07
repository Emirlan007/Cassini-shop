import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from 'src/schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { TokenAuthGuard } from 'src/auth/token-auth.guard';
import { RolesGuard } from 'src/role-auth/role-auth.guard';
import { Roles } from 'src/role-auth/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('banners')
export class BannersController {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

  @Get()
  async getBanners() {
    return this.bannerModel.find({ isActive: true });
  }

  @Get(':id')
  async getBannerById(@Param('id') id: string) {
    const banner = await this.bannerModel.findById(id);

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  @Post()
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  async createBanner(
    @Body() bannerData: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { title, description, link, isActive } = bannerData;

    if (!file) {
      throw new BadRequestException('Image is required');
    }

    const banner = new this.bannerModel({
      title,
      description,
      link,
      isActive,
      image: `/public/files/${file.filename}`,
    });

    return banner.save();
  }

  @Put(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  async updateBanner(
    @Param('id') id: string,
    @Body() bannerData: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const newBannerData = {
      ...bannerData,
      ...(file && { image: `/public/files/${file.filename}` }),
    };

    const updatedBanner = await this.bannerModel.findByIdAndUpdate(
      id,
      newBannerData,
      { new: true, runValidators: true },
    );

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }

    return updatedBanner;
  }

  @Patch(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async toggleBannerActive(@Param('id') id: string) {
    const banner = await this.bannerModel.findById(id);

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    banner.isActive = !banner.isActive;

    return banner.save();
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteBanner(@Param('id') id: string) {
    const banner = await this.bannerModel.findByIdAndDelete(id);

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return { message: 'Banner deleted' };
  }
}
