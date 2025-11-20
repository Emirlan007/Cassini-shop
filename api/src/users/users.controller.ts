import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterUserDto } from './register-user.dto';
import { LoginUserDto } from './login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';

import { FileUploadInterceptorAvatar } from 'src/shared/file-upload/file-upload.interceptor';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
  
  }

  @Post('register')
  @UseInterceptors(FileUploadInterceptorAvatar)
  async register(
    @Body() userData: RegisterUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { phoneNumber, displayName } = userData;
    const user = new this.userModel({
      phoneNumber,
      displayName,
      avatar: file ? `/public/files/${file.filename}` : null,
    });

    user.generateToken();

    return await user.save();
  }

  @Post('login')
  async login(@Body() userData: LoginUserDto) {
    const { phoneNumber, displayName } = userData;
    const user = await this.authService.validateUser(phoneNumber, displayName);
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
