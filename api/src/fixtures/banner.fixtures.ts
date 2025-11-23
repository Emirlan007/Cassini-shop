import { BannerService } from '../banners/banner.service';

export async function createBannerFixtures(bannerService: BannerService) {
  console.log('Creating banners...');

  return await bannerService.createMany([
    {
      title: 'Tuxedo Discount',
      description: 'Come and take for 50% off',
      image: '/fixtures/dress_carousel.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Dress Deals',
      description: 'Come and take for 50% off',
      image: '/fixtures/dressPos2.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Dress Fresh Arrive',
      description: 'Come and take for 50% off',
      image: '/fixtures/dress4.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Dress Hot Discount',
      description: 'Come and take for 50% off',
      image: '/fixtures/dress6.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Dress Hot Sales',
      description: 'Come and take for 50% off',
      image: '/fixtures/dress1.webp',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
  ]);
}
