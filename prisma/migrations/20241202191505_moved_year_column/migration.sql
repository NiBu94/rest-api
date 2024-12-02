/*
  Warnings:

  - You are about to drop the column `year` on the `booking` table. All the data in the column will be lost.
  - Added the required column `year` to the `Week` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `year`;

-- AlterTable
ALTER TABLE `week` ADD COLUMN `year` INTEGER NOT NULL;
