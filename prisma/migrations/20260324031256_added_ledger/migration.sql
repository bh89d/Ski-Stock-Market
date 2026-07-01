-- CreateEnum
CREATE TYPE "transaction" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "ledger" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transaction" "transaction" NOT NULL DEFAULT 'BUY',
    "price" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ledger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ledger" ADD CONSTRAINT "ledger_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger" ADD CONSTRAINT "ledger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
