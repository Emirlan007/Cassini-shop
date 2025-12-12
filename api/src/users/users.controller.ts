import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterUserDto } from './usersDto/register-user.dto';
import { LoginUserDto } from './usersDto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { FileUploadInterceptorAvatar } from 'src/shared/file-upload/file-upload.interceptor';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { Roles } from '../role-auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { UserService } from './user.service';
import { CartService } from 'src/cart/cart.service';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
    private cartService: CartService,
  ) {}

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('getAllUsers')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post('register')
  @UseInterceptors(FileUploadInterceptorAvatar)
  async register(
    @Body() userData: RegisterUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers('session-id') sessionId: string,
  ) {
    const { phoneNumber, name } = userData;

    if (!/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      throw new BadRequestException('Некорректный формат номера телефона');
    }

    const existingUser = await this.userModel.findOne({ phoneNumber });
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким номером уже существует',
      );
    }

    const user = new this.userModel({
      phoneNumber,
      name,
      avatar: file ? `/public/files/${file.filename}` : null,
    });

    user.generateToken();

    await this.cartService.mergeCart(String(user._id), sessionId);

    return await user.save();
  }

  @Post('login')
  async login(
    @Body() userData: LoginUserDto,
    @Headers('session-id') sessionId: string,
  ) {
    const { phoneNumber, name } = userData;

    if (!/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      throw new BadRequestException('Некорректный формат номера телефона');
    }

    const user = await this.userModel.findOne({ phoneNumber });

    if (!user) {
      throw new BadRequestException('Пользователь с таким номером не найден');
    }

    if (user.name !== name) {
      throw new BadRequestException('Неверное имя пользователя');
    }

    await this.cartService.mergeCart(String(user._id), sessionId);

    return user;
  }

  @Delete('logout')
  @HttpCode(204)
  async logout(@Headers('authorization') token?: string): Promise<void> {
    if (!token) return;
    const user = await this.userModel.findOne({ token });
    if (!user) return;
    user.generateToken();
    await user.save();
  }

  @UseGuards(TokenAuthGuard)
  @Patch(':id/address')
  async updateAddress(
    @Param('id') userId: string,
    @Body() body: { city: string; address: string },
  ) {
    const { city, address } = body;

    const updated = await this.userService.updateAddress(userId, city, address);

    if (!updated) {
      throw new NotFoundException('Пользователь не найден');
    }

    return updated;
  }
}
