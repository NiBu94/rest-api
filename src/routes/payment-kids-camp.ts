import { Router } from 'express';
import { sendSaferpayRequest } from '../services/saferpay-api';

const kidsCamp = Router();

kidsCamp.post('/kids-camp', async (req, res) => {
  try {
    const data = await sendSaferpayRequest();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message || 'An error occurred');
  }
});

export default kidsCamp;
