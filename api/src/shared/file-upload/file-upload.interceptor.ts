import { Injectable } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Injectable()
export class FileUploadInterceptorAvatar extends FileInterceptor('avatar', {
  storage: multerConfig.storage,
}) {}

@Injectable()
export class FileUploadInterceptorImages extends FilesInterceptor(
  'images',
  10,
  {
    storage: multerConfig.storage,
  },
) {}

@Injectable()
export class FileUploadInterceptorProduct extends FileFieldsInterceptor(
  [
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
  ],
  { storage: multerConfig.storage },
) {}