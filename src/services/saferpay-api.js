import axios from 'axios';
import crypto from 'crypto';
import config from '../configs/config.js';
import { getPaymentToken, insertTokens } from '../db/db.js';

const auth = config.secrets.saferpayAuth;

const header = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
  },
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

export const sendSaferpayRequest = async (price) => {
  const customToken = crypto.randomBytes(16).toString('hex');
  const modifiedReturnUrl = `https://neu.vandermerwe.ch/wp/bezahlung-verarbeitet/?token=${customToken}`;
  const data = {
    RequestHeader: {
      SpecVersion: '1.35',
      CustomerId: '269924',
      RequestId: '1F',
      RetryIndicator: 0,
    },
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
      Url: modifiedReturnUrl,
    },
  };
  const response = await axios.post('https://test.saferpay.com/api/Payment/v1/PaymentPage/Initialize', data, header);
  setCacheWithExpiration(customToken, response.data.Token);
  insertTokens(customToken, response.data.Token);
  return response.data;
};

export const checkPaymentStatus = async (customToken, operation) => {
  try {
    console.time('retrieveFrom');
    const saferpayToken = operation === 'cache' ? cache[customToken] : getPaymentToken(customToken);
    console.timeEnd('retrieveFrom');
    // if (!saferpayToken) {
    // return res.status(400).json({ message: 'Invalid or expired token' });
    // }
    const response = await axios.post(
      'https://test.saferpay.com/api/Payment/v1/PaymentPage/Assert',
      {
        RequestHeader: {
          SpecVersion: '1.35',
          CustomerId: '269924',
          RequestId: '1F',
          RetryIndicator: 0,
        },
        Token: saferpayToken,
      },
      header
    );

    const { Status } = response.data.Transaction;

    switch (Status) {
      case 'AUTHORIZED':
        console.log('Payment successful, sending emails...');
        break;
      case 'CANCELED':
        console.log('Payment was canceled, stopping polling.');
        break;
      case 'PENDING':
        console.log('Payment is pending, continue polling.');
        break;
      default:
        console.log(`Unknown status ${Status}, stopping polling.`);
        break;
    }
    return Status;
  } catch (err) {
    if (err.response && err.response.status === 402) {
      const errorMessage = err.response.data;
      console.log('API Error Message:', errorMessage);
      console.log(err.response.status);
      console.error('Polling too early, will try again.');
      // Continue polling, do not clear the interval
    } else {
      console.error('An unexpected error occurred while polling:', err);
    }
  }
};
