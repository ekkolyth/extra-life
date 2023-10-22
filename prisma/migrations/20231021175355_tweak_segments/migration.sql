/*
  Warnings:

  - You are about to drop the column `endsAt` on the `Segment` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Segment` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Segment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "endsAt",
DROP COLUMN "startsAt",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "index" INTEGER NOT NULL;
