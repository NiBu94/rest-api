import { Router } from 'express';
import validator from '../middleware/validator';
import paymentHandler from '../handlers/payment';

const router = Router();

router.post('/', validator, paymentHandler.createPayment);

router.get('/', paymentHandler.finalizePayment);

router.get('/failed', paymentHandler.paymentFailed);

router.get('/retry', paymentHandler.retryEmails);

export default router;
