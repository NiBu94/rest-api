/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Booking_customerId_key` ON `Booking`(`customerId`);
