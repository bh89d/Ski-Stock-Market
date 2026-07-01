/*
  Warnings:

  - The `regime` column on the `activeStock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[stockId]` on the table `activeStock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "marketRegime" AS ENUM ('BULL', 'BEAR', 'SIDE');

-- AlterTable
ALTER TABLE "activeStock" DROP COLUMN "regime",
ADD COLUMN     "regime" "marketRegime" NOT NULL DEFAULT 'SIDE';

-- CreateIndex
CREATE UNIQUE INDEX "activeStock_stockId_key" ON "activeStock"("stockId");
