import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (bookingId, name, maxDays, year) => {
  logger.debug(`Creating week with data: ${bookingId} ${name} ${maxDays} ${year}`);
  return prisma.week.create({
    data: {
      bookingId,
      name,
      maxDays,
      year,
    },
    select: {
      id: true,
    },
  });
};

const getManyWithDays = async (bookingId) => {
  logger.debug(`Fetching weeks and days with data: ${bookingId}`);
  return prisma.week.findMany({
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

const getMany = async (weeks, year) => {
  logger.debug(`Fetching weeks with data: ${weeks} ${year}`);
  return prisma.week.findMany({
    where: {
      year,
      name: { in: weeks },
      booking: {
        payment: {
          transactionStatus: 'CAPTURED',
        },
      },
    },
    select: {
      name: true,
      days: {
        select: {
          name: true,
        },
      },
      booking: {
        select: {
          customer: {
            select: {
              email: true,
              firstPhoneNumber: true,
              secondPhoneNumber: true,
              children: {
                select: {
                  firstName: true,
                  lastName: true,
                  birthday: true,
                  gender: true,
                  allowanceToGoHomeAlone: true,
                  allergies: true,
                },
              },
            },
          },
          payment: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });
};

export default {
  create,
  getManyWithDays,
  getMany,
};
