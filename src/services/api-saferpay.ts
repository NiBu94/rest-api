//@ts-nocheck
import axios from 'axios';
import config from '../configs/config';

const { auth, url, terminalId, customerId } = config.secrets.saferpay;

const header = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
  },
};

const createPayment = async (price, customToken, orderId, customerEmail) => {
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
      Url: `https://neu.vandermerwe.ch/wp/bezahlung-verarbeitet?customToken=${customToken}`,
    },

    Notification: {
      MerchantEmails: config.notification.split(','),
      PayerEmail: customerEmail,
      SuccessNotifyUrl: `https://${config.appURL}/${config.api}/payment?customToken=${customToken}`,
      FailNotifyUrl: `https://${config.appURL}/${config.api}/payment?customToken=${customToken}`,
    },
  };
  const response = await axios.post(`https://${url}/api/Payment/v1/PaymentPage/Initialize`, data, header);
  return response;
};

const checkPaymentStatus = async (paymentToken) => {
  const response = await axios.post(
    `https://${url}/api/Payment/v1/PaymentPage/Assert`,
    {
      RequestHeader: {
        SpecVersion: '1.35',
        RequestId: 'id',
        CustomerId: customerId,
        RetryIndicator: 0,
      },
      Token: paymentToken,
    },
    header
  );
  return response;
};

const capturePayment = async (transactionId) => {
  const response = await axios.post(
    `https://${url}/api/Payment/v1/Transaction/Capture`,
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
  return response;
};

export default {
  create: createPayment,
  checkStatus: checkPaymentStatus,
  capture: capturePayment,
};
