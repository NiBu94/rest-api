import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

//username is an email address

const get = async (id) => {
  logger.debug(`Fetching user with following data: ${id}`);
  return prisma.user.findUnique({ where: { id }, select: { id: true, createdAt: true, name: true } });
};

const getAll = async () => {
  return prisma.user.findMany({ select: { id: true, createdAt: true, name: true } });
};

const create = async (username, password) => {
  logger.debug(`Creating user with following data: ${username} ${password}`);
  return prisma.user.create({
    data: {
      name: username,
      password,
    },
  });
};

const update = async (user, userId) => {
  logger.debug(`Updating user with following data: ${JSON.stringify(user)}, ${userId}`);
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: user.name,
      password: user.password,
    },
  });
};

const deleteUser = async (username) => {
  logger.debug(`Deleting user with following data: ${username}`);
  await prisma.user.delete({
    where: {
      name: username,
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
