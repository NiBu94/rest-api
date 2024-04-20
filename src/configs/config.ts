import { PrismaClient } from '@prisma/client';
import session from 'express-session';
import MySQLSession from 'express-mysql-session';
import * as dotenv from 'dotenv';

dotenv.config();

const MySQLStore = MySQLSession(session);
const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};
const sessionStore = new MySQLStore(options);

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
    key: 'dashboardSessionId',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'Production', // Secure cookies in production
      httpOnly: true,
      sameSite: 'strict',
    },
  },
};
