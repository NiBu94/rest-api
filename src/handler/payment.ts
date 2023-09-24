import { logger } from '../configs/loggers';
import { captureOrCancelPayment, checkPaymentStatus, createPayment, statusCache } from '../services/api-saferpay';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { createEntities } from '../configs/db';

export const initializePayment = async (req, res, next) => {
  try {
    const { bookedWeeks, firstChild, secondChild, customer } = req.body;
    const customerId = uuidv4();
    let data = {
      id: customerId,
      ...customer, // spread customer object here
      children: [],
      bookings: [
        {
          bookedWeeks: [],
          payment: {},
        },
      ],
    };

    // Adding children
    data.children.push({ firstName: firstChild.firstName });
    if (secondChild.firstName !== '') {
      data.children.push({ firstName: secondChild.firstName });
    }

    // Price calculation logic remains unchanged
    const priceMap = {
      5: { 1: 75, 2: 150, 3: 225, 4: 290, 5: 290 },
      4: { 1: 75, 2: 150, 3: 225, 4: 240 },
      3: { 1: 75, 2: 150, 3: 180 },
    };
    let price = 0;
    let priceReduced = false;

    for (const weekObj of bookedWeeks) {
      for (const weekName in weekObj) {
        const weekDetails = weekObj[weekName];
        const maxDays = weekDetails.maxDays;
        const priceObj = priceMap[maxDays];
        const numDays = weekDetails.bookedDays.length;
        const days = weekDetails.bookedDays;

        price += priceObj[numDays];
        if (numDays === maxDays && secondChild.firstName !== '' && !priceReduced) {
          price -= 20;
          priceReduced = true;
        }

        const bookedWeekData = {
          weekName,
          maxDays,
          bookedDays: days.map((day) => ({ bookedDay: day })),
        };
        data.bookings[0].bookedWeeks.push(bookedWeekData);
      }
    }

    const customToken = crypto.randomBytes(16).toString('hex');
    const orderId = uuidv4();
    const resData = await createPayment(price * 100, customToken, orderId, customerId);
    data.bookings[0].payment = {
      amount: price,
      orderId,
      tokens: {
        customToken,
        paymentToken: resData.Token,
        expiresAt: resData.Expiration,
      },
    };

    createEntities(data);
    res.json({ redirectURL: resData.RedirectUrl });
  } catch (err) {
    logger.error(JSON.stringify(err.response.data));
    next(err);
  }
};

export const paymentStatus = async (req, res, next) => {
  try {
    logger.info(`frontendFirst`);
    const customToken = req.params.token as string;
    let status;
    let transactionId;

    if (statusCache[customToken]) {
      ({ status, transactionId } = statusCache[customToken]);
    } else {
      ({ status, transactionId } = await checkPaymentStatus(customToken));
    }

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
};

export const paymentSuccess = async (req, res, next) => {
  setTimeout(async () => {
    try {
      logger.info(`notificationFirst`);
      const customToken = req.params.token as string;
      let status;
      let transactionId;

      if (statusCache[customToken]) {
        ({ status, transactionId } = statusCache[customToken]);
      } else {
        ({ status, transactionId } = await checkPaymentStatus(customToken));
      }

      switch (status) {
        case 'AUTHORIZED':
          const response = await captureOrCancelPayment('Capture', transactionId);
          logger.info(JSON.stringify(response));
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
