-- CreateEnum
CREATE TYPE "DetectionValue" AS ENUM ('NORMAL', 'RISK', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "detection" "DetectionValue" NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokentabel" (
    "id" SERIAL NOT NULL,
    "token" INTEGER NOT NULL,

    CONSTRAINT "Tokentabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserDevices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserDevices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Device_code_key" ON "Device"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tokentabel_token_key" ON "Tokentabel"("token");

-- CreateIndex
CREATE INDEX "_UserDevices_B_index" ON "_UserDevices"("B");

-- AddForeignKey
ALTER TABLE "_UserDevices" ADD CONSTRAINT "_UserDevices_A_fkey" FOREIGN KEY ("A") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDevices" ADD CONSTRAINT "_UserDevices_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
