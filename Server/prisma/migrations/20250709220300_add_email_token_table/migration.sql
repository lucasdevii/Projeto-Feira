/*
  Warnings:

  - Added the required column `type` to the `Tokentabel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('SIGNUP', 'RESET_PASSWORD');

-- AlterTable
ALTER TABLE "Tokentabel" ADD COLUMN     "type" "TokenType" NOT NULL;
