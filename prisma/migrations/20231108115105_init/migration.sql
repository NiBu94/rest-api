/*
  Warnings:

  - You are about to drop the column `amount` on the `payment` table. All the data in the column will be lost.
  - Added the required column `price` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `amount`,
    ADD COLUMN `price` DOUBLE NOT NULL;
