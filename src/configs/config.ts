import * as dotenv from 'dotenv';
dotenv.config();
import merge from 'lodash.merge';

const env = process.env.NODE_ENV;

let envConfig;

if (env === 'production') {
  envConfig = require('./prod').default;
} else {
  envConfig = require('./dev').default;
}

export default merge(
  {
    env,
    port: process.env.PORT,
    appURL: process.env.APP_URL,
    api: process.env.API,
    notification: process.env.NOTIFICATION,
    secrets: {
      saferpay: {
        auth: process.env.SAFERPAY_AUTH,
        url: process.env.SAFERPAY_URL,
        terminalId: process.env.SAFERPAY_TERMINAL_ID,
        customerId: process.env.SAFERPAY_CUSTOMER_ID,
        receiversForNotifications: process.env.SAFERPAY_NOTIFICATION,
      },
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    logging: {
      console: true,
      file: false,
    },
  },
  envConfig
);
