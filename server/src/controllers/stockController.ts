import { getStock } from "../services/marketState.ts";
import type { Response, Request } from "express";
import prisma from "../config/db.ts";

export const getStocks = async(_req: Request, res: Response) => {
  const stocks = getStock().map((stock) => ({
    stockId: stock.stockId,
    tickerSymbol: stock.tickerSymbol,
    companyName: stock.company.companyName,
    currentPrice: stock.currentPrice,
    changePercent: ((stock.currentPrice - stock.basePrice) / stock.basePrice) * 100
  }));
  return res.status(200).json({
    status: "succes",
    data : stocks
  });
}

export const getStockHistory = async(req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({err: "Invalid stock id" })
  } 
  const stocks = await prisma.priceHistory.findMany({
    where: {stockId: id},
    orderBy: {createdAt: 'asc'},
    select: { 
      price :true, 
      createdAt: true}
  });

  return res.status(200).json({
    status: "success",
    data: stocks});
}

export const getSingleStock = async(req: Request, res:  Response) => {
  const {id} = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid Stock Id " })
  }
  const fetchStock = await prisma.stock.findUnique({
    where: {stockId: id},
    select : {
      stockId: true,
      currentPrice: true,
      company: {
        select: {
          companyName: true
        },
      },
    },
  });

  return res.status(200).json({ 
    status: "success",
    data : fetchStock
  });
}