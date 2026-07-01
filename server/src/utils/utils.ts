import prisma from "../config/db.ts";

export async function resetDayPrices(currentPrice : number, stockId : string) {
  await prisma.stock.update({
    where : { stockId : stockId },
    data : {
      dayHigh : currentPrice,
      dayLow : currentPrice
    }
  });
}