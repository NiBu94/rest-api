import config from '../../../configs/config';
import logger from '../../../configs/logger';

const { prisma } = config;

const create = async (bookingId, price) => {
  logger.debug(`Creating payment with data: ${bookingId} ${price}`);
  return await prisma.payment.create({
    data: {
      bookingId,
      price,
    },
    select: {
      id: true,
    },
  });
};

const get = async (paymentId) => {
  logger.debug(`Fetching payment with data: ${paymentId}`);
  return await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: {
      bookingId: true,
      transactionStatus: true,
      price: true,
    },
  });
};

const update = async (paymentId, responseCheckStatus, responseCapturePayment) => {
  logger.debug(`Updating payment with data: ${paymentId}\n${JSON.stringify(responseCheckStatus)}\n${JSON.stringify(responseCapturePayment)}`);
  const { Transaction, Liability } = responseCheckStatus.data;
  const { Status, CaptureId, Date } = responseCapturePayment.data;

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      transactionType: Transaction.Type,
      transactionId: Transaction.Id,
      transactionDate: Transaction.Date,
      acquirerName: Transaction.AcquirerName,
      acquirerReference: Transaction.AcquirerReference,
      sixTransactionReference: Transaction.SixTransactionReference,
      approvalCode: Transaction.ApprovalCode,
      liabilityShift: Liability.LiabilityShift,
      liableEntity: Liability.LiableEntity,
      transactionStatus: Status,
      captureId: CaptureId,
      captureDate: Date,
    },
  });
};

const updateOnFailure = async (paymentId, status) => {
  logger.warn(`Payment was cancelled. PaymentId: ${paymentId}`);
  logger.debug(`Updating payment (failure) with data: ${paymentId} ${status}`);
  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      transactionStatus: status,
    },
  });
};

export default {
  create,
  get,
  update,
  updateOnFailure,
};
