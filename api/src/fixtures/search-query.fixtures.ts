import { Model } from 'mongoose';
import { SearchQuery } from '../schemas/search-query.schema';

export async function createSearchQueryFixtures(
  searchQueryModel: Model<SearchQuery>,
) {
  console.log('Creating search queries...');

  const popularSearches = [
    'платье',
    'джинсы',
    'куртка',
    'обувь',
    'сумка',
    'платье красное',
    'джинсы синие',
    'куртка зимняя',
    'кроссовки',
    'платье вечернее',
    'рубашка',
    'брюки',
    'юбка',
    'пальто',
    'свитер',
  ];

  const queries: Array<{
    query: string;
    normalizedQuery: string;
    userId: null;
    sessionId: string;
    createdAt: Date;
  }> = [];


  for (const searchTerm of popularSearches) {
    
    const count = Math.floor(Math.random() * 45) + 5;

    for (let i = 0; i < count; i++) {
      queries.push({
        query: searchTerm,
        normalizedQuery: searchTerm.toLowerCase().trim(),
        userId: null,
        sessionId: `session-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ),
      });
    }
  }

  await searchQueryModel.insertMany(queries);
  console.log(`Created ${queries.length} search query entries`);
}
