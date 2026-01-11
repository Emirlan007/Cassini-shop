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
  Query,
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
import { BannerService } from './banner.service';
import { TranslatedField } from 'src/translation/translation.service';

interface BannerUpdateData {
  title?: TranslatedField;
  description?: TranslatedField;
  link?: string;
  isActive?: boolean;
  image?: string;
}

@Controller('banners')
export class BannersController {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    private readonly bannerService: BannerService,
  ) {}

  @Get()
  async getActiveBanners(@Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru') {
    return this.bannerService.getActiveBanners(lang);
  }

  @Get('all')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAllBanners(@Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru') {
    return this.bannerService.getAllBanners(lang);
  }

  @Get(':id')
  async getBannerById(
    @Param('id') id: string,
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
  ) {
    const banner = await this.bannerModel.findById(id).lean();

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    const title = banner.title as unknown as TranslatedField;
    const description = banner.description as unknown as
      | TranslatedField
      | undefined;

    return {
      ...banner,
      title: lang === 'ru' ? title.ru : title[lang] || title.ru,
      description: description
        ? lang === 'ru'
          ? description.ru
          : description[lang] || description.ru
        : undefined,
    };
  }

  @Post()
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  async createBanner(
    @Body() bannerData: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    const titleTranslations = await this.bannerService.autoTranslate(
      bannerData.title.ru,
    );

    let descriptionTranslations = { en: '' };
    if (bannerData.description?.ru) {
      descriptionTranslations = await this.bannerService.autoTranslate(
        bannerData.description.ru,
      );
    }

    const banner = new this.bannerModel({
      title: {
        ru: bannerData.title.ru,
        en: bannerData.title.en || titleTranslations.en,
        kg: bannerData.title.kg || '',
      },
      description: bannerData.description
        ? {
            ru: bannerData.description.ru,
            en: bannerData.description.en || descriptionTranslations.en,
            kg: bannerData.description.kg || '',
          }
        : undefined,
      link: bannerData.link,
      isActive: bannerData.isActive ?? true,
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
    const existingBanner = await this.bannerModel.findById(id);

    if (!existingBanner) {
      throw new NotFoundException('Banner not found');
    }

    const updateData: BannerUpdateData = {};

    if (bannerData.title) {
      const titleTranslations = await this.bannerService.autoTranslate(
        bannerData.title.ru,
      );

      updateData.title = {
        ru: bannerData.title.ru,
        en: bannerData.title.en || titleTranslations.en,
        kg: bannerData.title.kg || existingBanner.title.kg || '',
      };
    }

    if (bannerData.description) {
      const descriptionTranslations = await this.bannerService.autoTranslate(
        bannerData.description.ru,
      );

      const existingDescription = existingBanner.description as
        | TranslatedField
        | undefined;

      updateData.description = {
        ru: bannerData.description.ru,
        en: bannerData.description.en || descriptionTranslations.en,
        kg: bannerData.description.kg || existingDescription?.kg || '',
      };
    }

    if (bannerData.link !== undefined) {
      updateData.link = bannerData.link;
    }

    if (bannerData.isActive !== undefined) {
      updateData.isActive = bannerData.isActive;
    }

    if (file) {
      updateData.image = `/public/files/${file.filename}`;
    }

    return this.bannerModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
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
