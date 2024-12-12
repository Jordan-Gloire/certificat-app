/*
  Warnings:

  - You are about to drop the column `certificateType` on the `Certificate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Certificate` DROP COLUMN `certificateType`,
    ADD COLUMN `birthDate` VARCHAR(191) NULL,
    ADD COLUMN `formationDateDebut` DATETIME(3) NULL,
    ADD COLUMN `formationDateFin` DATETIME(3) NULL,
    ADD COLUMN `formationOption` VARCHAR(191) NULL;
