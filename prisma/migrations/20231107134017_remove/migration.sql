/*
  Warnings:

  - You are about to drop the `bookeddays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookedweek` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookeddays` DROP FOREIGN KEY `BookedDays_bookedWeekId_fkey`;

-- DropForeignKey
ALTER TABLE `bookedweek` DROP FOREIGN KEY `BookedWeek_bookingId_fkey`;

-- DropTable
DROP TABLE `bookeddays`;

-- DropTable
DROP TABLE `bookedweek`;

-- CreateTable
CREATE TABLE `Week` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `maxDays` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Day` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookedWeekId` INTEGER NOT NULL,
    `day` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Week` ADD CONSTRAINT `Week_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Day` ADD CONSTRAINT `Day_bookedWeekId_fkey` FOREIGN KEY (`bookedWeekId`) REFERENCES `Week`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
