import axios from 'axios';
import config from '../configs/config';

const auth = config.secrets.saferpayAuth;

const header = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
  },
};

export const sendSaferpayRequest = async (price) => {
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
  const response = await axios.post('https://test.saferpay.com/api/Payment/v1/PaymentPage/Initialize', data, header);
  return response.data;
};

export const pollPaymentStatus = (token) => {
  let intervalId;
  const poll = async () => {
    try {
      const response = await axios.post(
        'https://test.saferpay.com/api/Payment/v1/PaymentPage/Assert',
        {
          RequestHeader: {
            SpecVersion: '1.35',
            CustomerId: '269924',
            RequestId: '1F',
            RetryIndicator: 0,
          },
          Token: token,
        },
        header
      );

      const { Status } = response.data.Transaction;

      switch (Status) {
        case 'AUTHORIZED':
          console.log('Payment successful, sending emails...');
          clearInterval(intervalId); // Stop polling
          break;
        case 'CANCELED':
          console.log('Payment was canceled, stopping polling.');
          clearInterval(intervalId); // Stop polling
          break;
        case 'PENDING':
          console.log('Payment is pending, continue polling.');
          break;
        default:
          console.log(`Unknown status ${Status}, stopping polling.`);
          clearInterval(intervalId); // Stop polling
          break;
      }
    } catch (err) {
      if (err.response && err.response.status === 402) {
        const errorMessage = err.response.data;
        console.log('API Error Message:', errorMessage);
        console.log(err.response.status);
        console.error('Polling too early, will try again.');
        // Continue polling, do not clear the interval
      } else {
        console.error('An unexpected error occurred while polling:', err);
        clearInterval(intervalId); // Stop polling in case of an unexpected error
      }
    }
  };

  // First poll after 5 minutes
  setTimeout(() => {
    poll();

    // Subsequent polls every 1 minute
    intervalId = setInterval(poll, 10000); // Assign the interval ID here
  }, 10000); // 5 minutes in milliseconds
};
