-- CreateTable
CREATE TABLE "priceHistory" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "priceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "priceHistory_stockId_key" ON "priceHistory"("stockId");

-- AddForeignKey
ALTER TABLE "priceHistory" ADD CONSTRAINT "priceHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockId") ON DELETE RESTRICT ON UPDATE CASCADE;
