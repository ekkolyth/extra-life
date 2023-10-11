/*
  Warnings:

  - You are about to drop the column `createdAt` on the `WheelSpin` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WheelSpin` table. All the data in the column will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `donationAmount` to the `WheelSpin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donorName` to the `WheelSpin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WheelSpin" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "donationAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "donorName" TEXT NOT NULL,
ALTER COLUMN "isSpun" SET DEFAULT false;

-- DropTable
DROP TABLE "Schedule";

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);
