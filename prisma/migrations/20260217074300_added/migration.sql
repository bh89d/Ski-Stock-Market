/*
  Warnings:

  - The values [INFRASTRUTCURE] on the enum `industryType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[tickerSymbol]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "industryType_new" AS ENUM ('EQUIPMENT', 'APPAREL', 'RESORT', 'INFRASTRUCTURE', 'TECHNOLOGY');
ALTER TABLE "Company" ALTER COLUMN "industry" TYPE "industryType_new" USING ("industry"::text::"industryType_new");
ALTER TYPE "industryType" RENAME TO "industryType_old";
ALTER TYPE "industryType_new" RENAME TO "industryType";
DROP TYPE "public"."industryType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_tickerSymbol_key" ON "Stock"("tickerSymbol");
