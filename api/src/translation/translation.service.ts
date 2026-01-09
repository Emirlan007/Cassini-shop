import { Injectable } from '@nestjs/common';

export type TranslatedField = {
  ru: string;
  en?: string;
  kg?: string;
};

@Injectable()
export class TranslationService {
  async translateToEn(text: string): Promise<string> {
    if (!text.trim()) return '';

    const params = new URLSearchParams({
      auth_key: process.env.DEEPL_API_KEY!,
      text,
      source_lang: 'RU',
      target_lang: 'EN-US',
    });

    const response = await fetch(process.env.DEEPL_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepL error: ${error}`);
    }

    const data = (await response.json()) as {
      translations: { text: string }[];
    };

    return data.translations?.[0]?.text ?? '';
  }

  // async translateToKg(text: string): Promise<string> {
  //   if (!text.trim()) return '';

  //   const res = await fetch('https://libretranslate.com/translate', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       q: text,
  //       source: 'ru',
  //       target: 'ky',
  //       format: 'text',
  //       alternatives: 3,
  //       api_key: '',
  //     }),
  //     headers: { 'Content-Type': 'application/json' },
  //   });

  //   const data = (await res.json()) as { translatedText: string };

  //   return data.translatedText;
  // }

  // async translateFromRu(text: string): Promise<{ en: string; kg: string }> {
  //   const [en, kg] = await Promise.all([
  //     this.translateToEn(text),
  //     this.translateToKg(text),
  //   ]);

  //   return { en, kg };
  // }
}
