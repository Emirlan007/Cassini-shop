import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { TokenAuthGuard } from './token-auth.guard';
import { RolesGuard } from '../role-auth/role-auth.guard';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, TokenAuthGuard, RolesGuard],
  exports: [
    AuthService,
    TokenAuthGuard,
    RolesGuard,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class AuthModule {}
