import { Router } from 'express';
import { initializePayment, paymentFailure, paymentStatus, paymentSuccess } from '../handler/payment';

const router = Router();

router.post('/initialize', initializePayment);

router.get('/status/:token', paymentStatus);

router.get('/success/:token', paymentSuccess);

router.get('/failure/:token', paymentFailure);

export default router;
