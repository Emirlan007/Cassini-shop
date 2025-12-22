import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsUserExistsValidator } from './is-user-exists.validator';
import { User, UserSchema } from '../schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [IsUserExistsValidator],
  exports: [IsUserExistsValidator],
})
export class ValidationModule {}
