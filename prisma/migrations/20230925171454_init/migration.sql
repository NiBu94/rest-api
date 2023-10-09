/*
  Warnings:

  - The primary key for the `bookeddays` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bookeddays` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `bookedWeekId` on the `bookeddays` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `bookedweek` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bookedweek` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `bookeddays` DROP FOREIGN KEY `BookedDays_bookedWeekId_fkey`;

-- AlterTable
ALTER TABLE `bookeddays` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `bookedWeekId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `bookedweek` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `BookedDays` ADD CONSTRAINT `BookedDays_bookedWeekId_fkey` FOREIGN KEY (`bookedWeekId`) REFERENCES `BookedWeek`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
