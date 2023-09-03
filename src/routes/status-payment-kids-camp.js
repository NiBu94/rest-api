import { Router } from 'express';
import { cache, setCacheWithExpiration } from '../services/saferpay-api.js';

const paymentStatus = Router();

paymentStatus.get('/api/payment-status', async (req, res, next) => {
  const { myToken } = req.query;

  const saferpayToken = cache[myToken]?.value;
  if (!saferpayToken || cache[myToken]?.expiration < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  try {
    // Here, replace `pollPaymentStatus` with a function that directly checks the payment status once
    const paymentStatus = await checkPaymentStatus(saferpayToken);
    res.json({ status: paymentStatus });
  } catch (err) {
    next(err);
  }
});
