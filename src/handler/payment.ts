import { logger } from '../configs/loggers';
import { captureOrCancelPayment, checkPaymentStatus, createPayment, statusCache } from '../services/api-saferpay';

export const initializePayment = async (req, res, next) => {
  try {
    const priceMap = {
      5: { 1: 75, 2: 150, 3: 225, 4: 290, 5: 290 },
      4: { 1: 75, 2: 150, 3: 225, 4: 240 },
      3: { 1: 75, 2: 150, 3: 180 },
    };
    let price = 0;
    let priceReduced = false;

    const bookedWeeks = req.body.bookedWeeks;

    for (const weekObj of bookedWeeks) {
      for (const weekName in weekObj) {
        const weekDetails = weekObj[weekName];
        const maxDays = weekDetails.maxDays;
        const priceObj = priceMap[maxDays];
        const days = weekDetails.bookedDays.length;

        price += priceObj[days];

        if (days === maxDays && req.body.secondChild.firstName !== '' && !priceReduced) {
          price -= 20;
          priceReduced = true;
        }
      }
    }

    // Example Price: 100 CHF => 1.00 CHF
    const data = await createPayment(price * 100);
    res.json({ redirectURL: data.RedirectUrl });
  } catch (err) {
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
