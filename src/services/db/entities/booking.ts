import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (customerId) => {
  logger.debug(`Creating booking with data: ${customerId}`);
  return await prisma.booking.create({
    data: {
      customerId,
    },
    select: {
      id: true,
    },
  });
};

const getCustomer = async (bookingId) => {
  logger.debug(`Fetching customer with data: ${bookingId}`);
  const { customer } = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    select: {
      customer: true,
    },
  });
  return customer;
};

export default {
  create,
  getCustomer,
};
