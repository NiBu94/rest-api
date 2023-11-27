//@ts-nocheck
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import saferpay from '../services/api-saferpay';
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

    const booking = {
      customerId,
      weeks: {
        create: [],
      },
    };
    let price = 0;
    for (const week of bookedWeeks) {
      price += priceMap[week.maxDays][week.bookedDays.length] * children.length;
      if (week.bookedDays.length === week.maxDays && secondChild.firstName) {
        price -= 20;
      }
      booking.weeks.create.push({
        name: week.name,
        maxDays: week.maxDays,
        days: {
          create: week.bookedDays.map((day) => ({
            name: day,
          })),
        },
      });
    }

    const bookingId = await db.booking.create(booking);
    const customToken = crypto.randomBytes(16).toString('hex');
    const orderId = uuidv4();
    const response = await saferpay.create(price * 100, customToken, orderId, customer.email);
    await db.payment.create({
      bookingId,
      price,
      orderId,
      tokens: {
        create: {
          customToken,
          paymentToken: response.data.Token,
          expiresAt: response.data.Expiration,
        },
      },
    });

    res.status(201).json({ redirectURL: response.data.RedirectUrl });
  } catch (err) {
    next(err);
  }
};

export const paymentStatus = async (req, res, next) => {
  try {
    const { customToken } = req.query;
    const token = await db.token.read(customToken);
    let { transactionStatus } = await db.payment.read(token.paymentId);
    let responseCheckStatus;
    if (!transactionStatus) {
      responseCheckStatus = await saferpay.checkStatus(token.paymentToken);
      transactionStatus = responseCheckStatus.data.Transaction.Status;
    }

    switch (transactionStatus) {
      case 'AUTHORIZED':
        const responseCapturePayment = await saferpay.capture(responseCheckStatus.data.Transaction.Id);
        await db.payment.update(token.paymentId, {
          transactionType: responseCheckStatus.data.Transaction.Type,
          transactionId: responseCheckStatus.data.Transaction.Id,
          transactionDate: responseCheckStatus.data.Transaction.Date,
          acquirerName: responseCheckStatus.data.Transaction.AcquirerName,
          acquirerReference: responseCheckStatus.data.Transaction.AcquirerReference,
          sixTransactionReference: responseCheckStatus.data.Transaction.SixTransactionReference,
          approvalCode: responseCheckStatus.data.Transaction.ApprovalCode,
          liabilityShift: responseCheckStatus.data.Liability.LiabilityShift,
          liableEntity: responseCheckStatus.data.Liability.LiableEntity,
          transactionStatus: responseCapturePayment.data.Status,
          captureId: responseCapturePayment.data.CaptureId,
          captureDate: responseCapturePayment.data.Date,
        });

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
