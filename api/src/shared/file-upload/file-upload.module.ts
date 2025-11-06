import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multerConfig.storage,
    }),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService, MulterModule],
})
export class FileUploadModule {}
