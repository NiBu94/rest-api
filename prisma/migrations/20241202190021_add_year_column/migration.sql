/*
  Warnings:

  - Added the required column `year` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `year` INTEGER NOT NULL;
