-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "now" TEXT NOT NULL,
    "next" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);
