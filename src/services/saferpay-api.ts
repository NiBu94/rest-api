import axios from 'axios';

const user = process.env.SAFERPAY_USER;
const password = process.env.SAFERPAY_PASSWORD;
const authString = Buffer.from(`${user}:${password}`).toString('base64');

const data = {
  RequestHeader: {
    SpecVersion: "1.35",
    CustomerId: "269924",
    RequestId: "1F",
    RetryIndicator: 0
  },
  TerminalId: "17759815",
  Payment: {
    Amount: {
      Value: "100",
      CurrencyCode: "CHF"
    },
    OrderId: "1",
    Description: "Description of payment"
  },
  ReturnUrl: {
    Url: "https://neu.vandermerwe.ch/wp/"
  }
};

const options = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json',
    'Authorization': `Basic ${authString}`
  }
};

export const sendSaferpayRequest = async () => {
  try {
    const response = await axios.post('https://test.saferpay.com/api/Payment/v1/PaymentPage/Initialize', data, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};
