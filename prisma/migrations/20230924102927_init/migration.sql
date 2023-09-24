/*
  Warnings:

  - The values [FAILED] on the enum `Payment_transactionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `transactionStatus` ENUM('AUTHORIZED', 'CAPTURED', 'CANCELED') NULL;
