import { randomUUID } from "crypto";
import prisma from "../config/db";
import type { Request, Response } from "express";
import { avgBuyPrice } from "../utils/avgBuyPrice";
import { transaction } from "@prisma/client";

export async function buyStock(req: Request, res: Response) {
  const { stockId, quantity } = req.body;
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(404).json({ error: "User id not found" })
  }
  try {

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { userId: req.user?.userId },
        select: { balance: true }
      });

      if (!user) throw new Error(" User not found ");

      const stock = await tx.stock.findUnique({
        where: { stockId: stockId },
        select: {
          currentPrice: true
        }
      });

      if (!stock) throw new Error(" stock not found ");

      const stockInPortfolio = await tx.portfolio.findUnique({
        where: {
          userId_stockId: { userId: userId, stockId: stockId }
        },
        select: {
          quantity: true,
          avgBuyPrice: true
        }
      });

      let balance = user?.balance;

      const totalCost = quantity * stock?.currentPrice;

      let buyPrice = stock?.currentPrice;

      if (quantity <= 0) throw new Error(" Quantity of stock is invalid");

      let qty = quantity;

      if (stockInPortfolio && stockInPortfolio.avgBuyPrice) {
        qty = stockInPortfolio.quantity + quantity;
        buyPrice = avgBuyPrice(stockInPortfolio.avgBuyPrice, stockInPortfolio.quantity, stock?.currentPrice, quantity);
      }

      if (balance >= totalCost) {
        await tx.portfolio.upsert({
          where: { userId_stockId: { userId: userId, stockId: stockId } },
          update: {
            quantity: qty,
            avgBuyPrice: buyPrice
          },
          create: {
            portfolioId: randomUUID(),
            userId: userId,
            stockId: stockId,
            quantity: quantity,
            createdAt: new Date(),
            avgBuyPrice: buyPrice
          }
        });

      } else throw new Error("Not enough balance");

      await tx.stock.update({
        where: { stockId: stockId },
        data: {
          volume: {
            increment: quantity
          }
        }
      });

      balance -= totalCost;

      await tx.user.update({
        where: { userId: userId },
        data: {
          balance
        }
      });

      await tx.ledger.create({
        data: {
          id: randomUUID(),
          stockId: stockId,
          userId: userId,
          quantity: quantity,
          transaction : transaction.BUY,
          price: stock.currentPrice,
          avgBuyPrice: null,
          time: new Date()
        }
      });

      return res.status(200).json({
        status: "success",
        data: { stockId, totalCost, quantity, buyPrice }
      });
    })
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}


export async function sellStock(req: Request, res: Response) {
  const { stockId, quantity } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(404).json({ error: " User Id not found " })
  }

  try {
    await prisma.$transaction(async (tx) => {

      const stock = await tx.stock.findUnique({
        where: { stockId: stockId },
        select: {
          currentPrice: true
        }
      });

      if (!stock) throw new Error(" Stock not found ");

      const portfolio = await tx.portfolio.findUnique({
        where: {
          userId_stockId: { userId: userId, stockId: stockId }
        },
        select: {
          quantity: true,
          avgBuyPrice: true
        }
      });

      if (!portfolio) throw new Error(" Portfolio not found ");
      if (quantity <= 0) throw new Error("Quantity of stock is invalid");

      if (portfolio?.quantity < quantity) throw new Error(" Not enough stock in portfolio ");

      const qty = portfolio.quantity - quantity;

      if (qty !== 0 && qty > 0) {
        await tx.portfolio.update({
          where: {
            userId_stockId: { userId: userId, stockId: stockId }
          },
          data: {
            quantity: {
              decrement: quantity
            }
          }
        });
      } else {
        await tx.portfolio.delete({
          where : {
            userId_stockId: { userId: userId, stockId: stockId }
          }
        });
      }

      await tx.stock.update({
        where: { stockId: stockId },
        data: {
          volume: {
            increment: quantity
          }
        }
      });

      await tx.ledger.create({
        data: {
          id: randomUUID(),
          stockId: stockId,
          userId: userId,
          quantity: quantity,
          transaction : transaction.SELL,
          price: stock.currentPrice,
          avgBuyPrice: portfolio.avgBuyPrice,
          time: new Date()
        }
      });

      const totalRevenue = stock.currentPrice * quantity;

      await tx.user.update({
        where : {userId : userId},
        data : {
          balance : {
            increment : totalRevenue
          }
        }
      });

      return res.status(200).json({
        status: "success",
        data: { stockId, stock, quantity, totalRevenue }
      });
    });
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}