import { configDotenv } from 'dotenv';
import path from 'path';
const rootPath = __dirname;
const envFile = process.env['NODE_ENV']
  ? `.env.${process.env['NODE_ENV']}.local`
  : '.env';

configDotenv({ path: envFile });

const config = {
  db: process.env['MONGO_DB_URL'] || 'mongodb://localhost/cassini-shop',
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  port: process.env['PORT'] || 8000,
};

export default config;
