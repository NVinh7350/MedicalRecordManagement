-- CreateTable
CREATE TABLE `User` (
    `citizenId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `x509Identity` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `birthDay` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `role` ENUM('DOCTOR', 'PATIENT', 'ADMIN') NOT NULL,
    `ethnicity` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,

    PRIMARY KEY (`citizenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `citizenId` VARCHAR(191) NOT NULL,
    `HICNumber` VARCHAR(191) NULL,
    `guardianName` VARCHAR(191) NULL,
    `guardianPhone` VARCHAR(191) NULL,
    `guardianAddress` VARCHAR(191) NULL,

    PRIMARY KEY (`citizenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `citizenId` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NOT NULL,
    `hospital` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`citizenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalRecord` (
    `MRId` VARCHAR(191) NOT NULL,
    `status` ENUM('COMPLETED', 'CREATING') NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `typeMR` ENUM('INPATIENT', 'OUTPATIENT') NOT NULL,
    `specialty` VARCHAR(191) NULL,
    `bed` VARCHAR(191) NULL,
    `comeTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leaveTime` DATETIME(3) NULL,
    `ReExaminationTime` DATETIME(3) NULL,
    `personalMH` VARCHAR(191) NOT NULL,
    `familyMH` VARCHAR(191) NOT NULL,
    `majorReason` VARCHAR(191) NOT NULL,
    `pathogenesis` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `organs` VARCHAR(191) NOT NULL,
    `pulse` INTEGER NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `maxBP` INTEGER NOT NULL,
    `minBP` INTEGER NOT NULL,
    `breathing` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `summaryMR` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NOT NULL,
    `prognosis` VARCHAR(191) NOT NULL,
    `directionTreatment` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`MRId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `treatmentId` VARCHAR(191) NOT NULL,
    `diseaseProgression` VARCHAR(191) NOT NULL,
    `treatmentTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `MRId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`treatmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicine` (
    `treatmentId` VARCHAR(191) NOT NULL,
    `medicineId` VARCHAR(191) NOT NULL,
    `medicineName` VARCHAR(191) NOT NULL,
    `drugDosage` VARCHAR(191) NOT NULL,
    `drugFrequency` INTEGER NOT NULL,
    `totalDay` INTEGER NOT NULL,
    `specify` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`medicineId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Test` (
    `testId` VARCHAR(191) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `typeTest` VARCHAR(191) NOT NULL,
    `resultTest` VARCHAR(191) NOT NULL,
    `MRId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`testId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `testId` VARCHAR(191) NOT NULL,
    `value` LONGBLOB NOT NULL,

    PRIMARY KEY (`testId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessRequest` (
    `doctorId` VARCHAR(191) NOT NULL,
    `MRId` VARCHAR(191) NOT NULL,
    `requestTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `status` ENUM('AGREE', 'REFUSE') NOT NULL,

    PRIMARY KEY (`doctorId`, `MRId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `User`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `User`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_MRId_fkey` FOREIGN KEY (`MRId`) REFERENCES `MedicalRecord`(`MRId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicine` ADD CONSTRAINT `Medicine_treatmentId_fkey` FOREIGN KEY (`treatmentId`) REFERENCES `Treatment`(`treatmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_MRId_fkey` FOREIGN KEY (`MRId`) REFERENCES `MedicalRecord`(`MRId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`testId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRequest` ADD CONSTRAINT `AccessRequest_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRequest` ADD CONSTRAINT `AccessRequest_MRId_fkey` FOREIGN KEY (`MRId`) REFERENCES `MedicalRecord`(`MRId`) ON DELETE RESTRICT ON UPDATE CASCADE;
