import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>) {
    const createUser = new this.userModel(data);
    return createUser.save();
  }

  async createMany(dataArray: Partial<User>[]) {
    const users: UserDocument[] = [];
    for (const data of dataArray) {
      const user = await this.create(data);
      users.push(user);
    }
    return users;
  }
}
