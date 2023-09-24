import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEntities = async (data) => {
    await prisma.customer.create({
      data: {
        ...data,  // Spread the data object directly
        children: {
          create: data.children
        },
        bookings: {
          create: data.bookings.map(booking => ({
            bookedWeeks: {
              create: booking.bookedWeeks.map(week => ({
                weekName: week.weekName,
                maxDays: week.maxDays,
                bookedDays: {
                  create: week.bookedDays
                }
              }))
            },
            payment: {
              create: {
                ...booking.payment,
                tokens: {
                  create: booking.payment.tokens
                }
              }
            }
          }))
        }
      }
    });
};
