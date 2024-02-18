import logger from '../configs/logger';

const fiveDaysMax = new Map([
  [1, 75],
  [2, 150],
  [3, 225],
  [4, 290],
  [5, 290],
]);

const fourDaysMax = new Map([
  [1, 75],
  [2, 150],
  [3, 225],
  [4, 240],
]);

const threeDaysMax = new Map([
  [1, 75],
  [2, 150],
  [3, 180],
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
