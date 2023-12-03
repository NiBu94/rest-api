//@ts-nocheck
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createCustomer = async (data) => {
  const { id } = await prisma.customer.create({
    data,
    select: {
      id: true,
    },
  });
  return id;
};

const createChildren = async (data) => {
  await prisma.child.createMany({
    data,
  });
};

const createBooking = async (data) => {
  const { id } = await prisma.booking.create({
    data,
    select: {
      id: true,
    },
  });
  return id;
};

export const createPayment = async (data) => {
  await prisma.payment.create({
    data,
  });
};

const getTokens = async (customToken) => {
  const token = await prisma.tokens.findUnique({
    where: {
      customToken,
    },
    select: {
      paymentId: true,
      paymentToken: true,
    },
  });
  return token;
};

const getPayment = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: {
      transactionStatus: true,
    },
  });
  return payment;
};

const updatePayment = async (paymentId, data) => {
  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data,
  });
};

const getDataForEmails = async (customToken) => {
  return await prisma.tokens.findUnique({
    where: {
      customToken,
    },
    select: {
      payment: {
        select: {
          price: true,
          booking: {
            select: {
              customer: {
                include: {
                  children: true,
                },
              },
              weeks: {
                select: {
                  name: true,
                  days: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

const createUser = async (data) => {
  const user = await prisma.user.create({
    data,
  });
  return user;
};

const getUser = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
};

export default {
  customer: {
    create: createCustomer,
  },
  child: {
    createMany: createChildren,
  },
  booking: {
    create: createBooking,
  },
  payment: {
    create: createPayment,
    read: getPayment,
    update: updatePayment,
  },
  token: {
    read: getTokens,
  },
  email: {
    getData: getDataForEmails,
  },
  user: {
    create: createUser,
    read: getUser,
  },
};
