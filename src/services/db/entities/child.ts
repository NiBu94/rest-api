import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const createMany = async (firstChild, secondChild, customerId) => {
  logger.debug(`Creating children with data: ${JSON.stringify(firstChild)}\n${JSON.stringify(secondChild)}\n${customerId}`);
  firstChild.customerId = customerId;
  const children = [firstChild];

  if (secondChild.firstName) {
    secondChild.customerId = customerId;
    children.push(secondChild);
  }
  await prisma.child.createMany({ data: children });
};

const getMany = async (customerId) => {
  logger.debug(`Fetching children with data: ${customerId}`);
  return await prisma.child.findMany({
    where: {
      customerId,
    },
  });
};

export default {
  createMany,
  getMany,
};
