/*
  Warnings:

  - A unique constraint covering the columns `[userId,code]` on the table `UserDevices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `UserDevices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDevices" ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserDevices_userId_code_key" ON "UserDevices"("userId", "code");
