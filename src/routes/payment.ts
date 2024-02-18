import { Router } from 'express';
import validator from '../middleware/validator';
import paymentHandler from '../handlers/payment';

const router = Router();

router.post('/', validator, paymentHandler.createPayment);

router.get('/', paymentHandler.finalizePayment);

router.get('/failed', paymentHandler.finalizePayment);

export default router;
