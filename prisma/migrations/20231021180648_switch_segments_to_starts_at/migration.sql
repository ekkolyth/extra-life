/*
  Warnings:

  - You are about to drop the column `index` on the `Segment` table. All the data in the column will be lost.
  - Added the required column `startsAt` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Segment_index_key";

-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "index",
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL;
