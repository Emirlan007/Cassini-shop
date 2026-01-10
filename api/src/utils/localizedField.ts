export const localizedField = (field: string, lang: string) => ({
  $cond: {
    if: {
      $or: [
        { $eq: [`$${field}.${lang}`, ''] },
        { $not: [`$${field}.${lang}`] },
      ],
    },
    then: `$${field}.ru`,
    else: `$${field}.${lang}`,
  },
});
