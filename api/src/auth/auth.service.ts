import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUser(
    phoneNumber: string,
    name: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({
      phoneNumber: phoneNumber,
      name: name,
    });

    if (!user) {
      return null;
    }

    user.generateToken();
    await user.save();
    return user;
  }
}
