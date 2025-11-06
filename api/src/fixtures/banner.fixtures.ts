import { BannerService } from '../banners/banner..service';

export async function createBannerFixtures(bannerService: BannerService) {
  console.log('Creating banners...');

  return await bannerService.createMany([
    {
      title: 'Tuxedo Discount',
      description: 'Come and take for 50% off',
      image: '/fixtures/tuxedo1.jpg',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Tuxedo Deals',
      description: 'Come and take for 50% off',
      image: '/fixtures/tuxedo2.jpg',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Tuxedo Fresh Arrive',
      description: 'Come and take for 50% off',
      image: '/fixtures/tuxedo3.jpg',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Tuxedo Hot Discount',
      description: 'Come and take for 50% off',
      image: '/fixtures/tuxedo4.jpg',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: 'Tuxedo Hot Sales',
      description: 'Come and take for 50% off',
      image: '/fixtures/tuxedo5.webp',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
  ]);
}
