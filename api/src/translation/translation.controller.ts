import { Body, Controller, Post } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslateTextDto } from './dto/translate-text.dto';

@Controller('translation')
export class TranslationController {
  constructor(private translationService: TranslationService) {}

  @Post('translate/en')
  async translateToEn(@Body() dto: TranslateTextDto) {
    const translation = await this.translationService.translateToEn(dto.text);
    return { translation };
  }
}
