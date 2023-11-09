import { Router } from 'express';
import { initializePayment, paymentStatus } from '../handlers/payment';

const router = Router();

router.post('/', initializePayment);

router.get('/', paymentStatus);

export default router;
