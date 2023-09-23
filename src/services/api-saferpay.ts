import axios from 'axios';
import crypto from 'crypto';
import config from '../configs/config';
import prisma from '../configs/db';
import { logger } from '../configs/loggers';

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

export const tokenCache = {};
export const statusCache = {};

export const setTokenCache = (customToken, paymentToken) => {
  const expirationInMs = 60 * 60 * 500; // 30 minutes
  tokenCache[customToken] = paymentToken;

  // Remove the entry after the expiration time
  setTimeout(() => {
    delete tokenCache[customToken];
  }, expirationInMs);
};

export const setStatusCache = (customToken, obj) => {
  const expirationInMs = 60 * 60 * 500; // 30 minutes
  statusCache[customToken] = obj;

  // Remove the entry after the expiration time
  setTimeout(() => {
    delete statusCache[customToken];
  }, expirationInMs);
};

export const createPayment = async (price) => {
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
        Url: `https://neu.vandermerwe.ch/wp/bezahlung-verarbeitet?token=${customToken}`,
      },
      
      Notification: {
        MerchantEmails: ['contact@nbweb.solutions'],
        PayerEmail: 'contact@nbweb.solutions',
        SuccessNotifyUrl: `https://${config.appURL}/${config.api}/payment/success/${customToken}`,
        FailNotifyUrl: `https://${config.appURL}/${config.api}/payment/failure/${customToken}`,
      },
      
    };
    const res = await axios.post(`https://${config.saferpayURL}/${config.api}/Payment/v1/PaymentPage/Initialize`, data, header);
    setTokenCache(customToken, res.data.Token);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const checkPaymentStatus = async (customToken) => {
  try {
    const saferpayToken = tokenCache[customToken];
    const res = await axios.post(
      `https://${config.saferpayURL}/api/Payment/v1/PaymentPage/Assert`,
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
    setStatusCache(customToken, obj);
    return obj;
  } catch (err) {
    logger.error(JSON.stringify(err.response.data))
    throw err;
  }
};

export const captureOrCancelPayment = async (action, transactionId) => {
  try {
    const res = await axios.post(
      `https://${config.saferpayURL}/api/Payment/v1/Transaction/${action}`,
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
    logger.error(JSON.stringify(err.response.data))
    throw err;
  }
};
