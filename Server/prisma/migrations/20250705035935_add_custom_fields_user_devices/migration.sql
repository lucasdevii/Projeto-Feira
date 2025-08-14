/*
  Warnings:

  - Added the required column `customLocal` to the `UserDevices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customName` to the `UserDevices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDevices" ADD COLUMN     "customLocal" TEXT NOT NULL,
ADD COLUMN     "customName" TEXT NOT NULL;
