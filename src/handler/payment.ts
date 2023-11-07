//@ts-nocheck
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../configs/loggers';
import { captureOrCancelPayment, checkPaymentStatus, createPayment, statusCache } from '../services/api-saferpay';
import db from '../db';
import { sendEmails } from '../emails/payment-success-emails';

export const initializePayment = async (req, res, next) => {
  try {
    const { bookedWeeks, firstChild, secondChild, customer } = req.body;
    const priceMap = {
      5: { 1: 75, 2: 150, 3: 225, 4: 290, 5: 290 },
      4: { 1: 75, 2: 150, 3: 225, 4: 240 },
      3: { 1: 75, 2: 150, 3: 180 },
    };
    const customerId = await db.customer.create(customer);
    firstChild.customerId = customerId;
    const children = [firstChild];
    if (secondChild.firstName) {
      secondChild.customerId = customerId;
      children.push(secondChild);
    }
    await db.child.createMany(children);
    const booking = { customerId };

    let price = 0;

    for (const week of bookedWeeks) {
      price += priceMap[week.maxDays][week.bookedDays.length];
      if (week.bookedDays.length === week.maxDays && secondChild.firstName) {
        price -= 20;
      }
    }

    const customToken = crypto.randomBytes(16).toString('hex');
    const orderId = uuidv4();
    await db.booking.create();
    const redirectURL = await createPayment(price * 100, customToken, orderId, customer.email);
    res.status(201).json({ redirectURL });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};

export const paymentStatus = async (req, res, next) => {
  try {
    logger.info(`frontendFirst`);
    const customToken = req.params.token;
    let status;
    let transactionId;
    let paymentId;

    if (statusCache[customToken]) {
      ({ status } = statusCache[customToken]);
    } else {
      ({ status, transactionId, paymentId } = await checkPaymentStatus(customToken));
    }

    switch (status) {
      case 'AUTHORIZED':
        ({ paymentId } = await captureOrCancelPayment(customToken, 'Capture', transactionId));
        await updatePaymentWithCaptureDetails(paymentId);
        await sendEmails(customToken);
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
};

export const paymentSuccess = async (req, res, next) => {
  setTimeout(async () => {
    try {
      logger.info(`notificationFirst`);
      const customToken = req.params.token as string;
      let status;
      let transactionId;
      let paymentId;

      const status;
      if (statusCache[customToken]) {
        ({ status } = statusCache[customToken]);
      } else {
        ({ status, transactionId, paymentId } = await checkPaymentStatus(customToken));
      }

      switch (status) {
        case 'AUTHORIZED':
          ({ paymentId } = await captureOrCancelPayment(customToken, 'Capture', transactionId));
          await updatePaymentWithCaptureDetails(paymentId);
          await sendEmails(customToken);
        case 'CAPTURED':
          res.status(200).end();
          logger.info(`notificationFirstEnded`);
          break;
        case 'CANCELED':
          res.status(200).end();
          break;
      }
    } catch (err) {
      next(err);
    }
  }, 3000);
};

export const paymentFailure = async (req, res, next) => {
  const customToken = req.params.token;
  logger.info(`payment failed!: ${customToken}`);
  res.status(200).end();
};
