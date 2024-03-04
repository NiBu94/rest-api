//@ts-nocheck
import http from '../../configs/axios';
import config from '../../configs/config';
import logger from '../../configs/logger';

const { terminalId, customerId, url, auth, receiverForNotification, notifyUrl } = config.saferpay;

http.defaults.baseURL = `https://${url}/api/Payment/v1`;
http.defaults.timeout = 100 * 1000;
http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
http.defaults.headers.common.Accept = 'application/json';
http.defaults.headers.common.Authorization = `Basic ${auth}`;

const requestHeader = {
  SpecVersion: '1.38',
  CustomerId: customerId,
  RetryIndicator: 0,
};

const createPayment = async (requestId, price, customToken, bookingId, customerEmail) => {
  const data = {
    RequestHeader: {
      ...requestHeader,
      RequestId: requestId,
    },
    TerminalId: terminalId,
    Payment: {
      Amount: {
        Value: price * 100,
        CurrencyCode: 'CHF',
      },
      OrderId: bookingId,
      Description: 'Bezahlung für Kindercamps',
    },
    ReturnUrl: {
      Url: `https://fitnessallschwil.ch/wpt/bezahlung-verarbeitet?customToken=${customToken}`,
    },

    Notification: {
      MerchantEmails: [receiverForNotification],
      PayerEmail: customerEmail,
      SuccessNotifyUrl: `https://${notifyUrl}/${config.api}/payment?customToken=${customToken}`,
      FailNotifyUrl: `https://${notifyUrl}/${config.api}/payment/failed?customToken=${customToken}`,
    },
  };
  logger.debug(`Calling payment API to create a payment with the following data: ${JSON.stringify(data)}`);
  return await http.post('/PaymentPage/Initialize', data);
};

const checkPaymentStatus = async (requestId, paymentToken) => {
  const data = {
    RequestHeader: {
      ...requestHeader,
      RequestId: requestId,
    },
    Token: paymentToken,
  };
  logger.debug(`Calling payment API to check the payment status with the following data: ${JSON.stringify(data)}`);
  return await http.post(`/PaymentPage/Assert`, data);
};

const capturePayment = async (requestId, transactionId) => {
  const data = {
    RequestHeader: {
      ...requestHeader,
      RequestId: requestId,
    },
    TransactionReference: {
      TransactionId: transactionId,
    },
  };
  logger.debug(`Calling payment API to capture the payment with the following data: ${JSON.stringify(data)}`);
  return await http.post('/Transaction/Capture', data);
};

export default {
  create: createPayment,
  getStatus: checkPaymentStatus,
  finalize: capturePayment,
};
