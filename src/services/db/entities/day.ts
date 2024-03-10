import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const createMany = async (weekId, days) => {
  logger.debug(`Creating days with data: ${weekId} ${days}`);
  await prisma.day.createMany({
    data: days.map((day) => ({
      weekId,
      name: day,
    })),
  });
};

export default {
  createMany,
};
