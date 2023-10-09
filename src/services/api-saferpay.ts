//@ts-nocheck
import axios from 'axios';
import config from '../configs/config';
import { logger } from '../configs/loggers';
import { getPaymentToken, updatePayment } from '../db';

const { auth, url, terminalId, customerId } = config.secrets.saferpay;

const header = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
  },
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

export const createPayment = async (price, customToken, orderId) => {
  try {
    const data = {
      RequestHeader: {
        SpecVersion: '1.35',
        RequestId: 'id',
        CustomerId: customerId,
        RetryIndicator: 0,
      },
      TerminalId: terminalId,
      Payment: {
        Amount: {
          Value: price,
          CurrencyCode: 'CHF',
        },
        OrderId: orderId,
        Description: 'Bezahlung für Kindercamps',
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
    const res = await axios.post(`https://${url}/api/Payment/v1/PaymentPage/Initialize`, data, header);
    setTokenCache(customToken, res.data.Token);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const checkPaymentStatus = async (customToken) => {
  try {
    let saferpayToken = tokenCache[customToken];

    if (!saferpayToken) {
      saferpayToken = await getPaymentToken(customToken);
    }

    const res = await axios.post(
      `https://${url}/api/Payment/v1/PaymentPage/Assert`,
      {
        RequestHeader: {
          SpecVersion: '1.35',
          RequestId: 'id',
          CustomerId: customerId,
          RetryIndicator: 0,
        },
        Token: saferpayToken,
      },
      header
    );

    const { Status, Type, Id, Date, AcquirerName, AcquirerReference, SixTransactionReference, ApprovalCode } = res.data.Transaction;
    const { LiabilityShift, LiableEntity } = res.data.Liability;

    const obj = {
      status: Status,
      transactionId: Id,
    };

    const data = {
      transactionStatus: Status,
      transactionType: Type,
      transactionId: Id,
      transactionDate: Date,
      acquirerName: AcquirerName,
      acquirerReference: AcquirerReference,
      sixTransactionReference: SixTransactionReference,
      approvalCode: ApprovalCode,
      liabilityShift: LiabilityShift,
      liableEntity: LiableEntity,
    };

    obj.paymentId = await updatePayment(customToken, data);
    setStatusCache(customToken, obj);
    return obj;
  } catch (err) {
    logger.error(JSON.stringify(err.response.data));
    throw err;
  }
};

export const captureOrCancelPayment = async (customToken, action, transactionId) => {
  try {
    const res = await axios.post(
      `https://${url}/api/Payment/v1/Transaction/${action}`,
      {
        RequestHeader: {
          SpecVersion: '1.35',
          RequestId: 'id',
          CustomerId: customerId,
          RetryIndicator: 0,
        },
        TransactionReference: {
          TransactionId: transactionId,
        },
      },
      header
    );
    setStatusCache(customToken, { status: res.data.Status });
    return res.data;
  } catch (err) {
    logger.error(JSON.stringify(err.response.data));
    throw err;
  }
};
