import { configDotenv } from 'dotenv';

configDotenv();

const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
};

export default config;
