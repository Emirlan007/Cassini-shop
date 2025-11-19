import { configDotenv } from 'dotenv';
import path from 'path';
configDotenv();
const rootPath = __dirname;

const config = {
  db: 'mongodb://localhost/cassini-shop',
  rootPath,
  publicPath: path.join(rootPath, 'public'),
};

export default config;
