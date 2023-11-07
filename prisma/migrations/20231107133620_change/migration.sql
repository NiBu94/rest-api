/*
  Warnings:

  - You are about to drop the column `weekName` on the `bookedweek` table. All the data in the column will be lost.
  - Added the required column `name` to the `BookedWeek` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookedweek` DROP COLUMN `weekName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
