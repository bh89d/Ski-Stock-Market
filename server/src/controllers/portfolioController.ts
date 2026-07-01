import prisma from "../config/db.ts";
import type { Request, Response } from "express";

export async function getPortfolio(req: Request, res: Response) {
  const userId = req.user?.userId;

  try {
    const portfolio = await prisma.portfolio.findMany({
      where: { userId: userId },
      select: {
        portfolioId: true,
        avgBuyPrice: true,
        quantity: true,
        stock: {
          select: {
            stockId: true,
            tickerSymbol: true,
            currentPrice: true,
            company: {
              select: {
                companyName: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json({
      status: "success",
      data: portfolio
    });
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}

export async function getLedger(req: Request, res: Response) {
  const userId = req.user?.userId;

  try {

    const ledger = await prisma.ledger.findMany({
      where: { userId: userId },
      include: {
        stock: {
          omit: {
            stockId: true
          },
          include: {
            company: {
              omit: {
                companyId: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json({
      status: "success",
      data: ledger
    });

  } catch (err) {
    return res.status(400).json({ error: err })
  }
}

export async function getSingleStockPortfolio(req: Request, res: Response) {
  try {
    const { stockId } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }
    const data = await prisma.portfolio.findUnique({
      where: {
        userId_stockId: { userId: userId, stockId: stockId }
      }
    });
    return res.status(200).json({
      status: "success",
      data: data
    });
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}