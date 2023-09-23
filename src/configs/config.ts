import * as dotenv from 'dotenv';
dotenv.config();
import merge from 'lodash.merge';

const env = process.env.NODE_ENV;
const port = process.env.PORT;
const appURL = process.env.APP_URL;
const api = process.env.API;
const saferpayURL = process.env.SAFERPAY_URL;

let envConfig;

if (env === 'production') {
  envConfig = require('./prod').default;
} else {
  envConfig = require('./dev').default;
}

export default merge(
  {
    env,
    port,
    appURL,
    api,
    saferpayURL,
    secrets: {
      saferpayAuth: process.env.SAFERPAY_AUTH,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      smtpPassword: process.env.SMTP_PASS,
    },
    logging: {
      console: true,
      file: false,
    },
  },
  envConfig
);
