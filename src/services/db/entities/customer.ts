import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (customer) => {
  logger.debug(`Creating customer with data: ${JSON.stringify(customer)}`);
  return prisma.customer.create({
    data: customer,
    select: {
      id: true,
    },
  });
};

export default {
  create,
};
