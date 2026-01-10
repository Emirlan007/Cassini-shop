import { CategoriesService } from 'src/categories/categories.service';
export async function createCategoryFixtures(
  categoryServices: CategoriesService,
) {
  console.log('Creating categories...');

  const setOfFixtures = [
    {
      title: {
        ru: 'Верхняя одежда',
        en: 'Outerwear',
        kg: 'Үстүңкү кийим',
      },
      slug: 'top_closes',
    },
    {
      title: {
        ru: 'Платья и сарафаны',
        en: 'Dresses and Sundresses',
        kg: 'Көйнөктөр жана сарафандар',
      },
      slug: 'dresses',
    },
    {
      title: {
        ru: 'Блузы и рубашки',
        en: 'Blouses and Shirts',
        kg: 'Блузалар жана көйнөктөр',
      },
      slug: 'blousesNshirts',
    },
    {
      title: {
        ru: 'Брюки и шорты',
        en: 'Pants and Shorts',
        kg: 'Шым жана шорттор',
      },
      slug: 'pants-and-shorts',
    },
    {
      title: {
        ru: 'Юбки',
        en: 'Skirts',
        kg: 'Белдемчилер',
      },
      slug: 'skirts',
    },
    {
      title: {
        ru: 'Свитеры и кардиганы',
        en: 'Sweaters and Cardigans',
        kg: 'Свитерлер жана кардигандар',
      },
      slug: 'Sweaters-and-cardigans',
    },
    {
      title: {
        ru: 'Спортивная одежда',
        en: 'Sportswear',
        kg: 'Спорттук кийим',
      },
      slug: 'sportsWear',
    },
    {
      title: {
        ru: 'Нижнее бельё',
        en: 'Underwear',
        kg: 'Ич кийим',
      },
      slug: 'underwear',
    },
    {
      title: {
        ru: 'Купальники и пляжная одежда',
        en: 'Swimwear and Beachwear',
        kg: 'Суу кийимдер жана пляж кийимдери',
      },
      slug: 'Swimwear-and-beachwear',
    },
    {
      title: {
        ru: 'Домашняя одежда',
        en: 'Homewear',
        kg: 'Үй кийимдер',
      },
      slug: 'Homewear',
    },
  ];

  const createdCategories = await categoryServices.createMany(setOfFixtures);

  return createdCategories;
}
