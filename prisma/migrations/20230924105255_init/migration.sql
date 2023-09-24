/*
  Warnings:

  - You are about to drop the column `customerId` on the `payment` table. All the data in the column will be lost.
  - Added the required column `bookingId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_customerId_fkey`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `customerId`,
    ADD COLUMN `bookingId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
