import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cassini-shop'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
