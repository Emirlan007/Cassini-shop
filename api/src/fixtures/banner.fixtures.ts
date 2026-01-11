import { BannerService } from '../banners/banner.service';

export async function createBannerFixtures(bannerService: BannerService) {
  console.log('Creating banners...');

  return await bannerService.createMany([
    {
      title: {
        ru: 'Скидка на смокинги',
        en: 'Tuxedo Discount',
        kg: 'Смокингдерге арзандатуу',
      },
      description: {
        ru: 'Приходите и забирайте со скидкой 50%',
        en: 'Come and take for 50% off',
        kg: '50% арзандатуу менен алыңыз',
      },
      image: '/fixtures/dress_carousel.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: {
        ru: 'Выгодные предложения',
        en: 'Dress Deals',
        kg: 'Кийимдерге арзандатуу',
      },
      description: {
        ru: 'Приходите и забирайте со скидкой 50%',
        en: 'Come and take for 50% off',
        kg: '50% арзандатуу менен алыңыз',
      },
      image: '/fixtures/dress_carousel2.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: {
        ru: 'Новые поступления',
        en: 'Dress Fresh Arrive',
        kg: 'Жаңы келгендер',
      },
      description: {
        ru: 'Приходите и забирайте со скидкой 50%',
        en: 'Come and take for 50% off',
        kg: '50% арзандатуу менен алыңыз',
      },
      image: '/fixtures/dress_carousel3.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: {
        ru: 'Горячие скидки',
        en: 'Dress Hot Discount',
        kg: 'Ысык арзандатуулар',
      },
      description: {
        ru: 'Приходите и забирайте со скидкой 50%',
        en: 'Come and take for 50% off',
        kg: '50% арзандатуу менен алыңыз',
      },
      image: '/fixtures/dress_carousel4.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
    {
      title: {
        ru: 'Горячие распродажи',
        en: 'Dress Hot Sales',
        kg: 'Ысык сатуулар',
      },
      description: {
        ru: 'Приходите и забирайте со скидкой 50%',
        en: 'Come and take for 50% off',
        kg: '50% арзандатуу менен алыңыз',
      },
      image: '/fixtures/dress_carousel5.png',
      link: 'https://www.dobell.com/sale/tuxedos?srsltid=AfmBOooPHBQXNpSO3SHpDPqLukNUYIXnOl1DWAHwjuW2VC1iWoCMOzxK',
      isActive: true,
    },
  ]);
 }
