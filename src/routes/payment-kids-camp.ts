import { Router } from 'express';
import { sendSaferpayRequest } from '../services/saferpay-api';

const paymentKidsCamp = Router();

paymentKidsCamp.post('/saferpay', async (req, res, next) => {
  res.json({ message: req.body })
  res.status(200);
  /*
  try {
    // Example Price: 100 CHF => 1.00 CHF
    const price = req.body.fields.totalPrice.value * 100;
    const data = await sendSaferpayRequest(price);
    res.json({ redirectURL: data.RedirectUrl });
  } catch (e) {
    next(e);
  }
  */
});

export default paymentKidsCamp;
