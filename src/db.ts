//@ts-nocheck
import { PrismaClient } from '@prisma/client';
import { logger } from './configs/loggers';
const prisma = new PrismaClient();

export const createEntities = async (data) => {
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

export const getPaymentToken = async (customToken) => {
  try {
    const { paymentToken } = await prisma.tokens.findUnique({
      where: {
        customToken,
      },
      select: {
        paymentToken: true,
      },
    });
    return paymentToken;
  } catch (error) {}
};

export const updatePayment = async (customToken, data) => {
  try {
    const { paymentId } = await prisma.tokens.findUnique({
      where: {
        customToken,
      },
      select: {
        paymentId: true,
      },
    });

    if (!paymentId) {
      throw new Error('Token not found');
    }

    await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: data,
    });

    return paymentId;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

export const updatePaymentWithCaptureDetails = async (paymentId, data) => {
  try {
    await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: data,
    });
  } catch (error) {}
};

export const getDataForEmails = async (customToken) => {
  try {
    const result = await prisma.tokens.findUnique({
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

    return result;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};
