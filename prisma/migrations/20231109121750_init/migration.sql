-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
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
    `firstChild` BOOLEAN NOT NULL,
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
    `weekId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` VARCHAR(191) NOT NULL,
    `customToken` VARCHAR(191) NOT NULL,
    `paymentToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tokens_paymentId_key`(`paymentId`),
    UNIQUE INDEX `Tokens_customToken_key`(`customToken`),
    UNIQUE INDEX `Tokens_paymentToken_key`(`paymentToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'CHF',
    `orderId` VARCHAR(191) NOT NULL,
    `transactionStatus` ENUM('AUTHORIZED', 'CAPTURED', 'CANCELED') NULL,
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

    UNIQUE INDEX `Payment_bookingId_key`(`bookingId`),
    UNIQUE INDEX `Payment_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Child` ADD CONSTRAINT `Child_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Week` ADD CONSTRAINT `Week_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Day` ADD CONSTRAINT `Day_weekId_fkey` FOREIGN KEY (`weekId`) REFERENCES `Week`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
