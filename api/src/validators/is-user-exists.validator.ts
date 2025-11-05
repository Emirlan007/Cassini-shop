import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserExistsValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validate(value: string, args: ValidationArguments) {
    const shouldExist = args.constraints[0] as boolean;

    const user = await this.userModel.findOne({
      $or: [{ email: value }, { phoneNumber: value }],
    });

    return shouldExist ? !!user : !user;
  }

  defaultMessage(args: ValidationArguments) {
    const shouldExist = args.constraints[0] as boolean;

    return shouldExist
      ? 'User does not exist'
      : 'User with this email or phone already registered';
  }
}

export function IsUserExists(shouldExist: boolean = true) {
  return function (
    object: { constructor: CallableFunction },
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [shouldExist],
      options: { message: '' },
      validator: IsUserExistsValidator,
    });
  };
}
