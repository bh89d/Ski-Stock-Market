/*
  Warnings:

  - A unique constraint covering the columns `[userId,stockId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Portfolio_stockId_key";

-- DropIndex
DROP INDEX "Portfolio_userId_key";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "previousClose" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "volume" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_stockId_key" ON "Portfolio"("userId", "stockId");
