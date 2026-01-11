import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from 'src/schemas/banner.schema';
import {
  TranslationService,
  TranslatedField,
} from 'src/translation/translation.service';

export interface CreateBannerDto {
  title: TranslatedField;
  description?: TranslatedField;
  image: string;
  link?: string;
  isActive: boolean;
}

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    private translationService: TranslationService,
  ) {}

  async createMany(banners: CreateBannerDto[]): Promise<BannerDocument[]> {
    return (await this.bannerModel.insertMany(
      banners,
    )) as unknown as BannerDocument[];
  }

  async getActiveBanners(lang: 'ru' | 'en' | 'kg' = 'ru') {
    const banners = await this.bannerModel
      .find({ isActive: true })
      .lean()
      .exec();

    return banners.map((banner) => ({
      ...banner,
      title: this.getTranslatedValue(
        banner.title as unknown as TranslatedField,
        lang,
      ),
      description: banner.description
        ? this.getTranslatedValue(
            banner.description as unknown as TranslatedField,
            lang,
          )
        : undefined,
    }));
  }

  async getAllBanners(lang: 'ru' | 'en' | 'kg' = 'ru') {
    const banners = await this.bannerModel.find().lean().exec();

    return banners.map((banner) => ({
      ...banner,
      title: this.getTranslatedValue(
        banner.title as unknown as TranslatedField,
        lang,
      ),
      description: banner.description
        ? this.getTranslatedValue(
            banner.description as unknown as TranslatedField,
            lang,
          )
        : undefined,
    }));
  }

  private getTranslatedValue(
    field: TranslatedField,
    lang: 'ru' | 'en' | 'kg',
  ): string {
    if (lang === 'ru') return field.ru;

    const translation = field[lang];
    return translation && translation.trim() !== '' ? translation : field.ru;
  }

  async autoTranslate(textRu: string): Promise<{ en: string }> {
    const en = await this.translationService.translateToEn(textRu);
    return { en };
  }
}
