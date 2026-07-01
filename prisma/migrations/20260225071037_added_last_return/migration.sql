/*
  Warnings:

  - Added the required column `lastReturn` to the `activeStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activeStock" ADD COLUMN     "lastReturn" DOUBLE PRECISION NOT NULL;
