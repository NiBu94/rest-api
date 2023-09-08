import { Router } from 'express';
import { winstonLogger } from '../configs/loggers.js';

const paymentNotificationFailure = Router();

paymentNotificationFailure.get('/payment-notification-failure', async (req, res, next) => {
  const customToken = req.query.token;
  winstonLogger.info(`payment failed!: ${customToken}`);
  res.status(200);
});

export default paymentNotificationFailure;
