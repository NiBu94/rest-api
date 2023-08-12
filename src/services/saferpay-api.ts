import axios from 'axios';
import config from '../configs/config';

const user = config.secrets.saferpayUser;
const password = config.secrets.saferpayPassword;
const authString = Buffer.from(`${user}:${password}`).toString('base64');

const header = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: `Basic ${authString}`,
  },
};

export const sendSaferpayRequest = async (price) => {
  throw new Error('testError');
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
      Url: 'https://neu.vandermerwe.ch/wp/',
    },
  };

  const response = await axios.post(
    'https://test.saferpay.com/api/Payment/v1/PaymentPage/Initialize',
    data,
    header
  );
  return response.data;
};
