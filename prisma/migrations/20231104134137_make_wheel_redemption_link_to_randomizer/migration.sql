/*
  Warnings:

  - You are about to drop the column `wheelType` on the `WheelRedemption` table. All the data in the column will be lost.
  - Added the required column `randomizerId` to the `WheelRedemption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WheelRedemption" DROP COLUMN "wheelType",
ADD COLUMN     "randomizerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WheelRedemption" ADD CONSTRAINT "WheelRedemption_randomizerId_fkey" FOREIGN KEY ("randomizerId") REFERENCES "Randomizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
