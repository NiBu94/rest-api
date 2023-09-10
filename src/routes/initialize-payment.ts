import { Router } from 'express';
import { initializePayment } from '../services/saferpay-api';

const paymentKidsCamp = Router();

paymentKidsCamp.post('/initialize-payment', async (req, res, next) => {
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

        if (days === maxDays && !priceReduced) {
          price -= 20;
          priceReduced = true;
        }
      }
    }

    // Example Price: 100 CHF => 1.00 CHF
    const data = await initializePayment(price * 100);
    res.json({ redirectURL: data.RedirectUrl });
  } catch (err) {
    next(err);
  }
});

export default paymentKidsCamp;
