//@ts-nocheck
import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (data) => {
  logger.debug(`Creating weekData with data: ${JSON.stringify(data)}`);
  return prisma.weekData.create({
    data: {
      year: data.year,
      json: data.json,
    },
  });
};

const get = async (year) => {
  logger.debug(`Fetching weekData with data: ${year}`);
  const weekData = await prisma.weekData.findUnique({
    where: {
      year,
    },
    select: {
      json: true,
    },
  });
  return weekData.json;
};

const getAll = async () => {
  logger.debug(`Fetching all weekData`);
  return prisma.weekData.findMany({});
};

const getYears = async () => {
  logger.debug(`Fetching years`);
  const years = await prisma.weekData.findMany({
    select: {
      year: true,
    },
  });
  return years.map(yearObj => yearObj.year)
};

const update = async (data) => {
  logger.debug(`Updating weekData with data: ${year} ${data}`);
  return prisma.weekData.update({
    where: {
      year: data.year,
    },
    data: {
      year: data.year,
      json: data.json,
    },
  });
};

const deleteWeekData = async (year) => {
  logger.debug(`Deleting weekData with data: ${year}`);
  return prisma.weekData.delete({
    where: {
      year,
    },
  });
};

export default {
  create,
  get,
  getAll,
  getYears,
  update,
  deleteWeekData,
};
