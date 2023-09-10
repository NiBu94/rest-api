-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `streetNumber` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstPhoneNumber` VARCHAR(191) NOT NULL,
    `secondPhoneNumber` VARCHAR(191) NULL,
    `optionalMessage` VARCHAR(191) NULL,
    `agreementAGB` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Child` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `allowanceToGoHomeAlone` BOOLEAN NOT NULL,
    `allergies` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookedWeek` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `weekName` VARCHAR(191) NOT NULL,
    `maxDays` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookedDays` (
    `id` VARCHAR(191) NOT NULL,
    `bookedWeekId` VARCHAR(191) NOT NULL,
    `bookedDay` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tokens` (
    `id` VARCHAR(191) NOT NULL,
    `customToken` VARCHAR(191) NOT NULL,
    `paymentToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tokens_customToken_key`(`customToken`),
    UNIQUE INDEX `Tokens_paymentToken_key`(`paymentToken`),
    UNIQUE INDEX `Tokens_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'CHF',
    `orderId` VARCHAR(191) NOT NULL,
    `transactionStatus` ENUM('AUTHORIZED', 'CAPTURED', 'FAILED') NULL,
    `transactionType` VARCHAR(191) NULL,
    `transactionId` VARCHAR(191) NULL,
    `transactionDate` DATETIME(3) NULL,
    `acquirerName` VARCHAR(191) NULL,
    `acquirerReference` VARCHAR(191) NULL,
    `sixTransactionReference` VARCHAR(191) NULL,
    `approvalCode` VARCHAR(191) NULL,
    `liabilityShift` BOOLEAN NULL,
    `liableEntity` VARCHAR(191) NULL,
    `captureId` VARCHAR(191) NULL,
    `captureDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Child` ADD CONSTRAINT `Child_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookedWeek` ADD CONSTRAINT `BookedWeek_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookedDays` ADD CONSTRAINT `BookedDays_bookedWeekId_fkey` FOREIGN KEY (`bookedWeekId`) REFERENCES `BookedWeek`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
