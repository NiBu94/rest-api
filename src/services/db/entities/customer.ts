import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (customer) => {
  logger.debug(`Creating customer with data: ${JSON.stringify(customer)}`);
  return await prisma.customer.create({
    data: customer,
    select: {
      id: true,
    },
  });
};

const get = async (customerId) => {
  logger.debug(`Fetching customer with data: ${customerId}`);
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { id: true, children: true },
  });
};

export default {
  create,
};
