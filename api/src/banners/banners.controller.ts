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

function parseTranslatedField(value: unknown): TranslatedField | undefined {
  if (!value) return undefined;

  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      if (
        parsed &&
        typeof parsed === 'object' &&
        parsed !== null &&
        'ru' in parsed &&
        typeof (parsed as Record<string, unknown>).ru === 'string'
      ) {
        return parsed as TranslatedField;
      }
    } catch {
      return undefined;
    }
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'ru' in value &&
    typeof (value as Record<string, unknown>).ru === 'string'
  ) {
    return value as TranslatedField;
  }

  return undefined;
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
    @Body() rawData: Record<string, unknown>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    const title = parseTranslatedField(rawData.title);
    if (!title) {
      throw new BadRequestException('Invalid title format');
    }

    const description = parseTranslatedField(rawData.description);

    const titleTranslations = await this.bannerService.autoTranslate(title.ru);

    let descriptionTranslations = { en: '' };
    if (description?.ru) {
      descriptionTranslations = await this.bannerService.autoTranslate(
        description.ru,
      );
    }

    const banner = new this.bannerModel({
      title: {
        ru: title.ru,
        en: title.en || titleTranslations.en,
        kg: title.kg || '',
      },
      description: description
        ? {
            ru: description.ru,
            en: description.en || descriptionTranslations.en,
            kg: description.kg || '',
          }
        : undefined,
      link: typeof rawData.link === 'string' ? rawData.link : undefined,
      isActive: rawData.isActive ?? true,
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
    @Body() rawData: Record<string, unknown>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const existingBanner = await this.bannerModel.findById(id);

    if (!existingBanner) {
      throw new NotFoundException('Banner not found');
    }

    const updateData: BannerUpdateData = {};

    const title = parseTranslatedField(rawData.title);
    if (title) {
      const titleTranslations = await this.bannerService.autoTranslate(
        title.ru,
      );

      updateData.title = {
        ru: title.ru,
        en: title.en || titleTranslations.en,
        kg: title.kg || existingBanner.title.kg || '',
      };
    }

    const description = parseTranslatedField(rawData.description);
    if (description) {
      const descriptionTranslations = await this.bannerService.autoTranslate(
        description.ru,
      );

      const existingDescription = existingBanner.description;

      updateData.description = {
        ru: description.ru,
        en: description.en || descriptionTranslations.en,
        kg: description.kg || existingDescription?.kg || '',
      };
    }

    if (typeof rawData.link === 'string') {
      updateData.link = rawData.link;
    }

    if (typeof rawData.isActive === 'boolean') {
      updateData.isActive = rawData.isActive;
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
