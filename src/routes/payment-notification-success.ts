import { Router } from 'express';
import { winstonLogger } from '../configs/loggers';

const paymentNotificationSuccess = Router();

paymentNotificationSuccess.get('/payment-notification-success', async (req, res, next) => {
  const customToken = req.query.token;
  winstonLogger.info(`payment succesfull!: ${customToken}`);
  res.status(200).end();
});

export default paymentNotificationSuccess;
