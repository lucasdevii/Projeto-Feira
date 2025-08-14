/*
  Warnings:

  - Added the required column `detection` to the `UserDevices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDevices" ADD COLUMN     "detection" "DetectionValue" NOT NULL;
