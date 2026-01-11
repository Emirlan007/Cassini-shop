export function localizedField(fieldName: string, lang: 'ru' | 'en' | 'kg') {
  return {
    $ifNull: [
      `$${fieldName}.${lang}`,
      { $ifNull: [`$${fieldName}.ru`, `$${fieldName}`] },
    ],
  };
}