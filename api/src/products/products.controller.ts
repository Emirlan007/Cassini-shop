import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Patch,
  UploadedFiles,
  Query,
  Headers,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { FileUploadInterceptorProduct } from '../shared/file-upload/file-upload.interceptor';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { UpdatePopularStatusDto } from './dto/update-popular-status.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(
    @Query('searchValue') searchValue?: string,
    @Query('categoryId') categoryId?: string,
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
  ) {
    if (searchValue) {
      return this.productsService.findBySearch(searchValue);
    }
    return this.productsService.findAll(categoryId, lang);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('category') category: string,
    @Query('colors') colors: string,
    @Query('limit') limit = 16,
    @Query('page') page = 1,
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
    @Headers('authorization') token?: string,
    @Headers('session-id') sessionId?: string,
  ) {
    const colorsArray = colors ? colors.split(',') : undefined;

    return this.productsService.searchProducts({
      query,
      lang,
      category,
      colors: colorsArray,
      limit: Number(limit),
      page: Number(page),
      token,
      sessionId,
    });
  }

  @Get('popular')
  async getPopularProducts(
    @Query('page') page = '1',
    @Query('limit') limit = '8',
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
  ) {
    return this.productsService.findPopular(Number(page), Number(limit), lang);
  }

  @Get('filter')
  filterProducts(@Query() filters: FilterProductsDto) {
    return this.productsService.filterProducts(filters);
  }

  @Get(':id')
  async getProductById(
    @Param('id') id: string,
    @Query('lang') lang: 'ru' | 'en' | 'kg' = 'ru',
  ) {
    return this.productsService.findOne(id, lang);
  }

  @Post()
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileUploadInterceptorProduct)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files?: {
      images?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    return this.productsService.create(createProductDto, files);
  }

  @Patch(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileUploadInterceptorProduct)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files?: {
      images?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    return this.productsService.update(id, updateProductDto, files);
  }

  @Patch(':id/discount')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateProductDiscount(
    @Param('id') id: string,
    @Body() discountData: UpdateDiscountDto,
  ) {
    return this.productsService.updateDiscount(id, discountData);
  }

  @Patch(':id/popular')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findByIdAndUpdate(
    @Param('id') id: string,
    @Body() updatePopularStatus: UpdatePopularStatusDto,
  ) {
    return this.productsService.updatePopularStatus(id, updatePopularStatus);
  }

  @Patch(':id/new-status')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateNewStatus(
    @Param('id') id: string,
    @Body('isNew') isNew: boolean,
  ) {
    return this.productsService.updateNewStatus(id, isNew);
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product successfully deleted' };
  }
}
