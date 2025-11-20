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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { FileUploadInterceptorProduct } from '../shared/file-upload/file-upload.interceptor';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(
    @Query('searchValue') searchValue?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    if(searchValue){
      return this.productsService.findBySearch(searchValue);
    }
    return this.productsService.findAll(categoryId);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('category') category: string,
    @Query('colors') colors: string,
    @Query('limit') limit = '20',
  ) {
    const colorsArray = colors ? colors.split(',') : undefined;

    return this.productsService.searchProducts({
      query,
      category,
      colors: colorsArray,
      limit: Number(limit),
    });
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(id);
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

  @Delete(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product successfully deleted' };
  }
}
