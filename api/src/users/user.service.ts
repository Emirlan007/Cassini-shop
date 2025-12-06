import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find({ role: Role.User }).exec();
  }

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

  async updateAddress(
    userId: string,
    city: string,
    address: string,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { city, address },
      { new: true },
    );
  }
}
