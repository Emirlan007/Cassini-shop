import { diskStorage } from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import config from 'config';

export const multerConfig = {
  storage: diskStorage({
    destination: async function (req, file, cb) {
      const directory = path.join(process.cwd(), 'public', 'files');
      cb(null, directory);
    },
    filename: function (req, file, cb) {
      const ex = path.extname(file.originalname);
      const filename = randomUUID() + ex;
      console.log('Generated filename:', filename);
      cb(null, filename);
    },
  }),
};
