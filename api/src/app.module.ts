import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { IsUserExistsValidator } from './validators/is-user-exists.validator';
import { AuthService } from './auth/auth.service';
import { FileUploadModule } from './shared/file-upload/file-upload.module';

@Module({
  imports: [
    FileUploadModule,
    MongooseModule.forRoot('mongodb://localhost/cassini-shop'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UsersController],
  providers: [IsUserExistsValidator, AuthService],
})
export class AppModule {}
