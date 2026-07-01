-- CreateEnum
CREATE TYPE "marketPhase" AS ENUM ('PRE_MARKET', 'OPEN', 'AFTER_HOURS', 'CLOSED');

-- CreateTable
CREATE TABLE "marketClock" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "currentPhase" "marketPhase" NOT NULL DEFAULT 'CLOSED',
    "currentMarketTick" INTEGER NOT NULL,
    "currentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketClock_pkey" PRIMARY KEY ("id")
);
