import { Router } from 'express';
import { checkPaymentStatus, captureOrCancelPayment } from '../services/saferpay-api.js';
import { winstonLogger } from '../configs/loggers.js';

const paymentStatus = Router();

paymentStatus.get('/payment-status', async (req, res, next) => {
  try {
    const customToken = req.query.token;
    const { status, transactionId } = await checkPaymentStatus(customToken);
    switch (status) {
      case 'AUTHORIZED':
        const response = await captureOrCancelPayment('Capture', transactionId);
      case 'CAPTURED':
        res.status(200).json({ message: 'Danke für Ihre Bezahlung. Sie erhalten in kürze eine Bestätigungs E-Mail.' });
        break;
      case 'CANCELED':
        res.status(200).json({ message: 'Die Zahlung wurde durch Sie abgebrochen.' });
        break;
    }
  } catch (err) {
    next(err);
  }
});

export default paymentStatus;
