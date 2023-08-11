import merge from 'lodash.merge';

const env = process.env.NODE_ENV || 'local';

let envConfig = {};

if (env === 'production') {
  envConfig = require('./prod').default;
} else {
  envConfig = require('./dev').default;
}

export default merge(
  {
    env,
    port: process.env.PORT,
    secrets: {
      saferpayUser: process.env.SAFERPAY_USER,
      saferpayPassword: process.env.SAFERPAY_PASSWORD,
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
