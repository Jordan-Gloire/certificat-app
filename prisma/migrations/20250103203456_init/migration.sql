-- CreateTable
CREATE TABLE `Certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `birthDate` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `formationDateDebut` DATETIME(3) NULL,
    `formationDateFin` DATETIME(3) NULL,
    `formationOption` VARCHAR(191) NULL,
    `issueDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
