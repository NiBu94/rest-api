/*
  Warnings:

  - You are about to drop the column `orderId` on the `payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Payment_orderId_key` ON `payment`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `orderId`;
