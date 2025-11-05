import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      return null;
    }

    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return null;
    }

    user.generateToken();
    await user.save();
    return user;
  }
}
