import { Injectable } from "@nestjs/common";
import config from "config";
import { join } from 'path';


@Injectable()
export class FileUploadService{
    getFilePath(filename:string):string{
        return join(process.cwd(), config.publicPath, 'files', filename)
    }

    getPublicPath(filename:string):string{
        return `/${config.publicPath}/files/${filename}`
    }
}