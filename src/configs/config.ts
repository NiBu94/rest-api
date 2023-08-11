import merge from 'lodash.merge';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let envConfig = {};

export default merge({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  secrets: {
    saferpayUser: process.env.SAFERPAY_USER,
    saferpayPassword: process.env.SAFERPAY_PASSWORD,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASS,
  },
}, envConfig);
