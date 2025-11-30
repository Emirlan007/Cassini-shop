import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
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
  ) {
    const { phoneNumber, name } = userData;
    const user = new this.userModel({
      phoneNumber,
      name,
      avatar: file ? `/public/files/${file.filename}` : null,
    });

    user.generateToken();

    return await user.save();
  }

  @Post('login')
  async login(@Body() userData: LoginUserDto) {
    const { phoneNumber, name } = userData;
    const user = await this.authService.validateUser(phoneNumber, name);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Delete('logout')
  @HttpCode(204)
  async logout(@Headers('authorization') token?: string): Promise<void> {
    if (!token) return;
    const user = await this.userModel.findOne({ token });
    if (!user) return;
    user.generateToken();
  }
}
