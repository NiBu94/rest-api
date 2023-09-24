/*
  Warnings:

  - Added the required column `firstChild` to the `Child` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `child` ADD COLUMN `firstChild` BOOLEAN NOT NULL;
