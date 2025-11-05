import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../role-auth/role-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product successfully deleted' };
  }
}