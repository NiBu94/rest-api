import axios from 'axios';
import crypto from 'crypto';
import config from '../configs/config';
import prisma from '../configs/db';
import { winstonLogger } from '../configs/loggers';

const auth = config.secrets.saferpayAuth;

const header = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
  },
};

const saferpayHeader = {
  SpecVersion: '1.35',
  RequestId: 'id',
  CustomerId: '269924',
  RetryIndicator: 0,
};

export const cache = {};

export function setCacheWithExpiration(customToken, paymentToken) {
  const expirationInMs = 60 * 60 * 500; // 30 minutes
  cache[customToken] = paymentToken;

  // Remove the entry after the expiration time
  setTimeout(() => {
    delete cache[customToken];
  }, expirationInMs);
}

export const initializePayment = async (price) => {
  try {
    const customToken = crypto.randomBytes(16).toString('hex');
    const data = {
      RequestHeader: saferpayHeader,
      TerminalId: '17759815',
      Payment: {
        Amount: {
          Value: price,
          CurrencyCode: 'CHF',
        },
        OrderId: '1',
        Description: 'OrderDescription',
      },
      ReturnUrl: {
        Url: `https://neu.vandermerwe.ch/wp/bezahlung-verarbeitet/?token=${customToken}`,
      },
      /*
      Notification: {
        MerchantEmails: ['contact@nbweb.solutions'],
        PayerEmail: 'contact@nbweb.solutions',
        SuccessNotifyUrl: `https://6k4vq9ct-5000.euw.devtunnels.ms/api/payment-notification-success/?token=${customToken}`,
        FailNotifyUrl: `https://6k4vq9ct-5000.euw.devtunnels.ms/api/payment-notification-failure/?token=${customToken}`,
      },
      */
    };
    const res = await axios.post('https://test.saferpay.com/api/Payment/v1/PaymentPage/Initialize', data, header);
    setCacheWithExpiration(customToken, res.data.Token);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const checkPaymentStatus = async (customToken) => {
  try {
    const saferpayToken = cache[customToken];
    const res = await axios.post(
      'https://test.saferpay.com/api/Payment/v1/PaymentPage/Assert',
      {
        RequestHeader: saferpayHeader,
        Token: saferpayToken,
      },
      header
    );

    const obj = {
      status: res.data.Transaction.Status,
      transactionId: res.data.Transaction.Id,
    };
    return obj;
  } catch (err) {
    throw err;
  }
};

export const captureOrCancelPayment = async (action, transactionId) => {
  try {
    const res = await axios.post(
      `https://test.saferpay.com/api/Payment/v1/Transaction/${action}`,
      {
        RequestHeader: saferpayHeader,
        TransactionReference: {
          TransactionId: transactionId,
        },
      },
      header
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
