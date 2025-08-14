/*
  Warnings:

  - You are about to drop the `_UserDevices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserDevices" DROP CONSTRAINT "_UserDevices_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserDevices" DROP CONSTRAINT "_UserDevices_B_fkey";

-- DropTable
DROP TABLE "_UserDevices";

-- CreateTable
CREATE TABLE "UserDevices" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceId" INTEGER NOT NULL,

    CONSTRAINT "UserDevices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDevices_userId_deviceId_key" ON "UserDevices"("userId", "deviceId");

-- AddForeignKey
ALTER TABLE "UserDevices" ADD CONSTRAINT "UserDevices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDevices" ADD CONSTRAINT "UserDevices_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
