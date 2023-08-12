import { Router } from 'express';
import { sendSaferpayRequest } from '../services/saferpay-api';

const kidsCamp = Router();

kidsCamp.post('/saferpay', async (req, res) => {
  try {
    // Example Price: 100 CHF => 1.00 CHF
    const price = req.body.fields.totalPrice.value * 100;
    const data = await sendSaferpayRequest(price);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message || 'An error occurred');
  }
});

export default kidsCamp;
