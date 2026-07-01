/*
  Warnings:

  - You are about to drop the column `liquIdityFactor` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `liquidityFactor` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "liquIdityFactor",
ADD COLUMN     "liquidityFactor" DOUBLE PRECISION NOT NULL;
