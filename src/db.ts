//@ts-nocheck
import { PrismaClient } from '@prisma/client';
import { logger } from './configs/loggers';
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
  return await prisma.booking.create({
    data,
  });
};
export const createPayment = async (data) => {
  return await prisma.payment.create({
    data,
  });
};

const createEntities = async (data) => {
  try {
    await prisma.customer.create({
      data: {
        ...data.customer,
        children: {
          create: data.children,
        },
        bookings: {
          create: {
            bookedWeeks: {
              create: data.bookings.bookedWeeks.map((week) => ({
                weekName: week.weekName,
                maxDays: week.maxDays,
                bookedDays: {
                  create: week.bookedDays,
                },
              })),
            },
            payment: {
              create: {
                ...data.bookings.payment,
                tokens: {
                  create: data.bookings.payment.tokens,
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    logger.error(error.message);
  }
};

const getPaymentToken = async (customToken) => {
  const { paymentToken } = await prisma.tokens.findUnique({
    where: {
      customToken,
    },
    select: {
      paymentToken: true,
    },
  });
  return paymentToken;
};

const getPaymentId = async (customToken) => {
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

const updatePayment = async (paymentId, data) => {
  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data,
  });
};

const updatePaymentWithCaptureDetails = async (paymentId, data) => {
  try {
    await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: data,
    });
  } catch (error) {}
};

const getDataForEmails = async (customToken) => {
  return await prisma.tokens.findUnique({
    where: {
      customToken,
    },
    select: {
      payment: {
        select: {
          amount: true,
          booking: {
            select: {
              customer: {
                include: {
                  children: true,
                },
              },
              bookedWeeks: {
                select: {
                  weekName: true,
                  bookedDays: {
                    select: {
                      bookedDay: true,
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
};
