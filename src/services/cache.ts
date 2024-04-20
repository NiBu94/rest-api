import logger from '../configs/logger';

const cache = new Map();

const set = (key, value) => {
  cache.set(key, value);
  setTimeout(() => {
    cache.delete(key);
    logger.info(`Cache item with key=${key} has been removed after 10 minutes.`);
  }, 1000 * 60 * 10);
};

const get = (key) => {
  return cache.get(key);
};

export default {
  get,
  set,
};
