/*
  Warnings:

  - You are about to drop the column `bookedWeekId` on the `day` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `weekId` to the `Day` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `day` DROP FOREIGN KEY `Day_bookedWeekId_fkey`;

-- AlterTable
ALTER TABLE `day` DROP COLUMN `bookedWeekId`,
    ADD COLUMN `weekId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_key` ON `Payment`(`orderId`);

-- AddForeignKey
ALTER TABLE `Day` ADD CONSTRAINT `Day_weekId_fkey` FOREIGN KEY (`weekId`) REFERENCES `Week`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
