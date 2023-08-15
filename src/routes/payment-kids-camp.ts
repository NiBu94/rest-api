import { Router } from 'express';
import { sendSaferpayRequest } from '../services/saferpay-api';

const paymentKidsCampt = Router();

paymentKidsCampt.post('/saferpay', async (req, res, next) => {
  try {
    // Example Price: 100 CHF => 1.00 CHF
    const price = req.body.fields.totalPrice.value * 100;
    const data = await sendSaferpayRequest(price);
    // res.json(data);
    res.redirect(data.RedirectUrl);
  } catch (e) {
    next(e);
  }
});

export default paymentKidsCampt;
