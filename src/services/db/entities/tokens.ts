import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (paymentId, customToken, paymentToken, expirationDate) => {
  logger.debug(`Creating tokens with data: ${paymentId} ${customToken} ${paymentToken} ${expirationDate}`);
  prisma.tokens.create({
    data: {
      paymentId,
      customToken,
      paymentToken,
      expiresAt: expirationDate,
    },
  });
};

const get = async (customToken) => {
  logger.debug(`Fetching tokens with data: ${customToken}`);
  return prisma.tokens.findUnique({
    where: {
      customToken,
    },
    select: {
      paymentId: true,
      paymentToken: true,
    },
  });
};

const getPaymentId = async (customToken) => {
  logger.debug(`Fetching paymentId with data: ${customToken}`);
  const { paymentId } = await prisma.tokens.findUnique({
    where: {
      customToken,
    },
    select: {
      paymentId: true,
    },
  });
  return paymentId;
};

export default {
  create,
  get,
  getPaymentId,
};
