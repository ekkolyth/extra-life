-- CreateTable
CREATE TABLE "Randomizer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Randomizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RandomizerItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "randomizerId" TEXT NOT NULL,

    CONSTRAINT "RandomizerItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RandomizerItem" ADD CONSTRAINT "RandomizerItem_randomizerId_fkey" FOREIGN KEY ("randomizerId") REFERENCES "Randomizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
