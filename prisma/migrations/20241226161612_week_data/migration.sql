-- CreateTable
CREATE TABLE `WeekData` (
    `year` INTEGER NOT NULL,
    `json` JSON NOT NULL,

    PRIMARY KEY (`year`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
