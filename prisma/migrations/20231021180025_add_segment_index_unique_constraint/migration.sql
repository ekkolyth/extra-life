/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `Segment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Segment_index_key" ON "Segment"("index");
