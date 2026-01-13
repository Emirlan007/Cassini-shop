import { diskStorage } from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

export const multerConfig = {
  storage: diskStorage({
    destination: function (req, file, cb) {
      const directory = path.join(process.cwd(), 'public', 'files');

      fs.mkdir(directory, { recursive: true })
        .then(() => cb(null, directory))
        .catch((err) => cb(err, directory));
    },
    filename: function (req, file, cb) {
      const ex = path.extname(file.originalname);
      const filename = randomUUID() + ex;
      console.log('Generated filename:', filename);
      cb(null, filename);
    },
  }),
};
