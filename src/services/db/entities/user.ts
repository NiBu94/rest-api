import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const get = async (email) => {
  logger.debug(`Fetching user with following data: ${email}`);
  return prisma.user.findUnique({ where: { email }, select: { id: true, password: true } });
};

const getAll = async () => {
  return prisma.user.findMany({ select: { id: true, createdAt: true, email: true } });
};

const create = async (email, password) => {
  logger.debug(`Creating user with following data: ${email}`);
  await prisma.user.create({
    data: {
      email,
      password,
    },
  });
};

const update = async (email, password) => {
  logger.debug(`Updating user with following data: ${email}`);
  return prisma.user.update({
    where: {
      email: email,
    },
    data: {
      email: email,
      password: password,
    },
  });
};

const deleteUser = async (email) => {
  logger.debug(`Deleting user with following data: ${email}`);
  await prisma.user.delete({
    where: {
      email,
    },
  });
};

export default {
  get,
  getAll,
  create,
  update,
  deleteUser,
};
