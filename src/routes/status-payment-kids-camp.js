import { Router } from 'express';
import { checkPaymentStatus } from '../services/saferpay-api.js';

const paymentStatus = Router();

paymentStatus.get('/payment-status', async (req, res, next) => {
  try {
    const customToken = req.query.token;
    const operation = req.query.operation;
    const paymentStatus = await checkPaymentStatus(customToken, operation);
    res.json({ status: paymentStatus });
  } catch (err) {
    next(err);
  }
});

export default paymentStatus;