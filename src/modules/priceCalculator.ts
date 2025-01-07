import logger from '../configs/logger';

const fiveDaysMax = new Map([
  [1, 80],
  [2, 160],
  [3, 240],
  [4, 315],
  [5, 315],
]);

const fourDaysMax = new Map([
  [1, 80],
  [2, 160],
  [3, 240],
  [4, 255],
]);

const threeDaysMax = new Map([
  [1, 80],
  [2, 160],
  [3, 195],
]);

const priceMap = new Map([
  [5, fiveDaysMax],
  [4, fourDaysMax],
  [3, threeDaysMax],
]);

export const calculatePrice = (week, secondChild) => {
  logger.debug(`Calculating price with data: ${JSON.stringify(week)}`);
  let price = priceMap.get(week.maxDays).get(week.bookedDays.length) * (secondChild.firstName ? 2 : 1);
  logger.debug(`Price: ${price}`);
  if (week.bookedDays.length === week.maxDays && secondChild.firstName) {
    price -= 20;
    logger.debug(`Price after reduction: ${price}`);
  }
  return price;
};
