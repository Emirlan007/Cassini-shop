import { Injectable } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "./multer.config";

@Injectable()
export class FileUploadInterceptorAvatar extends FileInterceptor("avatar", {
    storage:multerConfig.storage
}){}

@Injectable()
export class FileUploadInterceptorImages extends FileInterceptor("images", {
    storage:multerConfig.storage
}){}