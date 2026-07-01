/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stockId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avgBuyPrice` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "avgBuyPrice" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_key" ON "Portfolio"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_stockId_key" ON "Portfolio"("stockId");
