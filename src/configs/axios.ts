//@ts-nocheck
import axios from 'axios';
import logger from './logger';
import config from './config';
import { createGermanDateTime } from '../modules/formatDate';

const httpClientPaymentService = axios.create();

function colorStatus(status) {
  if (status >= 500) return '\x1b[31m';
  if (status >= 400) return '\x1b[33m';
  if (status >= 300) return '\x1b[36m';
  if (status >= 200) return '\x1b[32m';
  return '\x1b[0m';
}

httpClientPaymentService.interceptors.request.use((request) => {
  request.hrStartTime = process.hrtime();
  return request;
});

httpClientPaymentService.interceptors.response.use(
  (response) => {
    const { method, url, hrStartTime } = response.config;

    const hrDuration = process.hrtime(hrStartTime);
    const durationInMilliseconds = (hrDuration[0] * 1000 + hrDuration[1] / 1e6).toFixed(3);

    const consoleFormat = `[OUT] ${method.toUpperCase()} ${url} ${colorStatus(response.status)}${response.status}\x1b[0m ${durationInMilliseconds}ms - ${
      response.headers['content-length']
    }`;
    const fileFormat = `${createGermanDateTime()} HTTP: [OUT] [${response.data.ResponseHeader.RequestId}] ${method.toUpperCase()} ${url} ${
      response.status
    } ${durationInMilliseconds}ms ${response.headers['content-length']}`;
    logger.http(config.env === 'local' ? consoleFormat : fileFormat);

    return response;
  },
  (error) => {
    if (error.response) {
      const { method, url, hrStartTime } = error.config;
      const hrDuration = process.hrtime(hrStartTime);
      const durationInMilliseconds = (hrDuration[0] * 1000 + hrDuration[1] / 1e6).toFixed(3);

      const consoleFormat = `[OUT] ${method.toUpperCase()} ${url} ${colorStatus(error.response.status)}${error.response.status}\x1b[0m ${durationInMilliseconds}ms - ${
        error.response.headers['content-length']
      }`;
      const fileFormat = `${createGermanDateTime()} HTTP: [OUT] ${method.toUpperCase()} ${url} ${
        error.response.status
      } ${durationInMilliseconds}ms ${error.response.headers['content-length']}`;
      logger.http(config.env === 'local' ? consoleFormat : fileFormat);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      logger.http(`[OUT] No response received for request: ${error.request}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.http(`[OUT] Request setup failed: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default httpClientPaymentService;
