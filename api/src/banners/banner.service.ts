import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from 'src/schemas/banner.schema';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

  async create(data: Partial<Banner>) {
    const createBanner = new this.bannerModel(data);
    return createBanner.save();
  }

  async createMany(dataArray: Partial<Banner>[]) {
    const banners: BannerDocument[] = [];
    for (const data of dataArray) {
      const banner = await this.create(data);
      banners.push(banner);
    }
    return banners;
  }
}
