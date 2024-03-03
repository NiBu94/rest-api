import crypto from 'crypto';
import db from '../services/db/dbService';
import config from '../configs/config';
import paymentService from '../services/payment/paymentService';
import emailService from '../services/email/emailService';
import { calculatePrice } from '../modules/priceCalculator';
import { AxiosError } from 'axios';
import logger from '../configs/logger';

const createPayment = async (req, res) => {
  try {
    const customer = await db.customer.create(req.body.customer);
    await db.child.createMany(req.body.firstChild, req.body.secondChild, customer.id);
    const booking = await db.booking.create(customer.id);

    let price = 0;
    for (const bookedWeek of req.body.bookedWeeks) {
      const week = await db.week.create(booking.id, bookedWeek.name, bookedWeek.maxDays);
      await db.day.createMany(week.id, bookedWeek.bookedDays);
      price += calculatePrice(bookedWeek, req.body.secondChild);
    }

    const customToken = crypto.randomBytes(16).toString('hex');
    const response = await paymentService.create(req.id, price, customToken, booking.id, req.body.customer.email);
    if (config.env === 'local') logger.info(JSON.stringify(response.data.RedirectUrl));
    const payment = await db.payment.create(booking.id, price);
    await db.tokens.create(payment.id, customToken, response.data.Token, response.data.Expiration);
    res.sendStatus(201).json({ redirectURL: response.data.RedirectUrl });
  } catch (err) {
    logger.error(err);
    if (err instanceof AxiosError) {
      logger.error(JSON.stringify(err.response.data));
    }
    res.sendStatus(500).json({ message: 'Internal server error' });
  }
};

const finalizePayment = async (req, res) => {
  try {
    const tokens = await db.tokens.get(req.query.customToken);
    const payment = await db.payment.get(tokens.paymentId);
    let responseCheckStatus;
    if (!payment.transactionStatus) {
      responseCheckStatus = await paymentService.getStatus(req.id, tokens.paymentToken);
      payment.transactionStatus = responseCheckStatus.data.Transaction.Status;
    }

    switch (payment.transactionStatus) {
      case 'AUTHORIZED':
        const responseCapturePayment = await paymentService.finalize(req.id, responseCheckStatus.data.Transaction.Id);
        await db.payment.update(tokens.paymentId, responseCheckStatus, responseCapturePayment);
        const customer = await db.booking.getCustomer(payment.bookingId);
        const children = await db.child.getMany(customer.id);
        const weeks = await db.week.getManyWithDays(payment.bookingId);
        await emailService.sendPaymentSuccessToCustomer(customer, children, weeks, payment.price);
        await emailService.sendPaymentSuccessToOwner(customer, children, weeks, payment.price);
      case 'CAPTURED':
        res.sendStatus(200).json({ message: 'Danke für Ihre Bezahlung. Sie erhalten in kürze zwei Bestätigungs-E-Mails.' });
        break;
      case 'CANCELED':
        res.sendStatus(200).json({ message: 'Die Zahlung wurde durch Sie abgebrochen.' });
        break;
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.data?.ErrorName === 'TRANSACTION_ABORTED') {
        try {
          const paymentId = await db.tokens.getPaymentId(req.query.customToken);
          await db.payment.updateOnFailure(paymentId, 'CANCELED');
        } catch (err) {
          logger.error(`Failed updating canceled payment: ${req.query.customToken}`, err);
        }
        res.sendStatus(200).json({ message: 'Die Zahlung wurde durch Sie abgebrochen.' });
      } else {
        logger.error(JSON.stringify(err.response.data));
      }
    } else {
      logger.error(err);
      res.sendStatus(500).json({ message: 'Internal server error' });
    }
  }
};

const paymentFailed = async (req, res) => {
  try {
    const paymentId = await db.tokens.getPaymentId(req.query.customToken);
    await db.payment.updateOnFailure(paymentId, 'CANCELED');
    res.sendStatus(200).end();
  } catch (err) {
    logger.error(`Failed updating canceled payment: ${req.query.customToken}`);
    res.sendStatus(200).end();
  }
};

export default {
  createPayment,
  finalizePayment,
  paymentFailed,
};
