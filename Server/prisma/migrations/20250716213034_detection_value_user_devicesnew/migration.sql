/*
  Warnings:

  - The values [CRITICAL] on the enum `DetectionValue` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `detection` on the `UserDevices` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DetectionValue_new" AS ENUM ('NORMAL', 'RISK');
ALTER TABLE "Device" ALTER COLUMN "detection" TYPE "DetectionValue_new" USING ("detection"::text::"DetectionValue_new");
ALTER TYPE "DetectionValue" RENAME TO "DetectionValue_old";
ALTER TYPE "DetectionValue_new" RENAME TO "DetectionValue";
DROP TYPE "DetectionValue_old";
COMMIT;

-- AlterTable
ALTER TABLE "UserDevices" DROP COLUMN "detection";
