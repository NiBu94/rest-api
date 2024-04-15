import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export default {
  env: process.env.NODE_ENV,
  prisma,
  port: process.env.PORT,
  api: process.env.API,
  saferpay: {
    auth: process.env.SAFERPAY_AUTH,
    url: process.env.SAFERPAY_URL,
    terminalId: process.env.SAFERPAY_TERMINAL_ID,
    customerId: process.env.SAFERPAY_CUSTOMER_ID,
    receiverForNotification: process.env.SAFERPAY_NOTIFICATION,
    notifyUrl: process.env.SAFERPAY_NOTIFY_URL,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  admin: {
    user: process.env.ADMIN_USER,
    pass: process.env.ADMIN_PASS,
  },
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    },
  },
};
