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
import { OAuth2Client } from 'google-auth-library';
import { FileUploadInterceptorAvatar } from 'src/shared/file-upload/file-upload.interceptor';

@Controller('users')
export class UsersController {
  private googleClient: OAuth2Client;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(clientId);
  }

  @Post('register')
  @UseInterceptors(FileUploadInterceptorAvatar)
  async register(
    @Body() userData: RegisterUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { email, phoneNumber, password, displayName } = userData;
    const user = new this.userModel({
      email,
      phoneNumber,
      password,
      displayName,
      avatar: file ? `/public/files/${file.filename}` : null,
    });

    user.generateToken();

    return await user.save();
  }

  @Post('login')
  async login(@Body() userData: LoginUserDto) {
    const { email, password } = userData;

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  @Post('google')
  async loginWithGoogle(@Body('credential') credential: string) {
    if (!credential) {
      throw new BadRequestException('Google credential is required');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      throw new BadRequestException('Not enough user data to continue');
    }

    const {
      email,
      sub: googleId,
      name: displayName,
      picture: avatar,
    } = payload;

    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      user = await this.userModel.findOne({ email });
    }

    if (!user) {
      user = new this.userModel({
        email,
        phoneNumber: email,
        password: 'Qwerty123',
        googleId,
        displayName,
        avatar,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
    }

    if (displayName) user.displayName = displayName;
    if (avatar) user.avatar = avatar;

    user.generateToken();

    await user.save();

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
