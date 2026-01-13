import { CategoriesService } from 'src/categories/categories.service';
export async function createCategoryFixtures(
  categoryServices: CategoriesService,
) {
  console.log('Creating categories...');

  const setOfFixtures = [
    {
      title: 'Верхняя одежда',
      slug: 'top_closes',
    },
    {
      title: 'Платья и сарафаны',
      slug: 'dresses',
    },
    {
      title: 'Топы',
      slug: 'tops',
    },
    {
      title: 'Брюки и джинсы',
      slug: 'pants-and-jeans',
    },
    {
      title: 'Юбки',
      slug: 'skirts',
    },
    {
      title: 'Свитеры и кардиганы',
      slug: 'Sweaters-and-cardigans',
    },
    {
      title: 'Спортивная одежда',
      slug: 'sportsWear',
    },
    {
      title: 'Нижнее бельё',
      slug: 'underwear',
    },
    {
      title: 'Купальники и пляжная одежда',
      slug: 'Swimwear-and-beachwear',
    },
    {
      title: 'Домашняя одежда',
      slug: 'Homewear',
    },
  ];

  const createdCategories = await categoryServices.createMany(setOfFixtures);

  return createdCategories;
}
