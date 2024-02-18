import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (bookingId, name, maxDays) => {
  logger.debug(`Creating week with data: ${bookingId} ${name} ${maxDays}`);
  return await prisma.week.create({
    data: {
      bookingId,
      name,
      maxDays,
    },
    select: {
      id: true,
    },
  });
};

const getManyWithDays = async (bookingId) => {
  logger.debug(`Fetching weeks and days with data: ${bookingId}`);
  return await prisma.week.findMany({
    where: {
      bookingId,
    },
    select: {
      name: true,
      days: {
        select: {
          name: true,
        },
      },
    },
  });
};

export default {
  create,
  getManyWithDays,
};
