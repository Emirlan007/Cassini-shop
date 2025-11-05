import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { HydratedDocument, Model } from 'mongoose';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: HydratedDocument<UserDocument>;
}

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const token = request.get('Authorization');

    if (!token) {
      return false;
    }

    const user = await this.userModel.findOne({ token: token });

    if (!user) {
      return false;
    }

    request.user = user;

    return true;
  }
}
