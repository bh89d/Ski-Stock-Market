/*
  Warnings:

  - You are about to drop the column `liquidityFactor` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `volatility` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "liquidityFactor",
DROP COLUMN "volatility";

-- CreateTable
CREATE TABLE "activeStock" (
    "stockId" TEXT NOT NULL,
    "volatility" DOUBLE PRECISION NOT NULL,
    "liquidityFactor" DOUBLE PRECISION NOT NULL,
    "regime" TEXT NOT NULL,
    "regimeTicksLeft" INTEGER NOT NULL,
    "drift" DOUBLE PRECISION NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "volatilityMultiplier" DOUBLE PRECISION NOT NULL,
    "lastShockAt" TIMESTAMP(3) NOT NULL,
    "momentumCounter" INTEGER NOT NULL,

    CONSTRAINT "activeStock_pkey" PRIMARY KEY ("stockId")
);

-- AddForeignKey
ALTER TABLE "activeStock" ADD CONSTRAINT "activeStock_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockId") ON DELETE RESTRICT ON UPDATE CASCADE;
