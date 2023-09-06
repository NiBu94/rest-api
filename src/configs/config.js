import * as dotenv from 'dotenv';
dotenv.config();
import merge from 'lodash.merge';
import prodConfig from './prod.js';
import devConfig from './dev.js';

const env = process.env.NODE_ENV || 'local';
const port = process.env.PORT || '5000';

let envConfig;

if (env === 'production') {
  envConfig = prodConfig;
} else {
  envConfig = devConfig;
}

export default merge(
  {
    env,
    port,
    secrets: {
      saferpayAuth: process.env.SAFERPAY_AUTH,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      smtpPassword: process.env.SMTP_PASS,
      dbHost: process.env.DB_HOST,
      dbUser: process.env.DB_USER,
      dbPassword: process.env.DB_PASS,
      dbName: process.env.DB_NAME,
    },
    logging: {
      console: true,
      file: false,
    },
  },
  envConfig
);
