import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserDocument = User & Document & UserMethods;

@Schema()
export class User {
  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    unique: true,
  })
  phoneNumber: string;

  @Prop()
  googleId: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  displayName: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (this: User) {
  this.token = crypto.randomUUID();
};

UserSchema.methods.checkPassword = function (this: User, password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.set('toJSON', {
  transform: (_doc, ret: Partial<User>) => {
    delete ret.password;
    return ret;
  },
});
