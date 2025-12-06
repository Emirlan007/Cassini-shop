import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as crypto from 'node:crypto';
import { Document } from 'mongoose';

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserDocument = User & Document & UserMethods;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  phoneNumber: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  token: string;

  @Prop({
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin'],
  })
  role: string;

  @Prop()
  city: string;

  @Prop()
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (this: User) {
  this.token = crypto.randomUUID();
};
