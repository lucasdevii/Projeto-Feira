/*
  Warnings:

  - A unique constraint covering the columns `[emailUser]` on the table `Tokentabel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailUser` to the `Tokentabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameUser` to the `Tokentabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordUser` to the `Tokentabel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tokentabel" ADD COLUMN     "emailUser" TEXT NOT NULL,
ADD COLUMN     "nameUser" TEXT NOT NULL,
ADD COLUMN     "passwordUser" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tokentabel_emailUser_key" ON "Tokentabel"("emailUser");
