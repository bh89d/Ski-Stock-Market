import { marketPhase, marketRegime } from "@prisma/client";
import prisma from "../config/db.ts";
import { gaussian } from "../utils/gaussian.ts";
import type { StockDTO } from "../types/types.ts";
import { resetDayPrices } from "../utils/utils.ts";


async function updateStocks(stocks: StockDTO[], currentPhase: marketPhase) {
  let dampeningFactor;

  if (currentPhase === marketPhase.OPEN) {
    dampeningFactor = 1;
  } else if (currentPhase === marketPhase.PRE_MARKET) {
    dampeningFactor = 0.3
  } else if (currentPhase === marketPhase.AFTER_HOURS) {
    dampeningFactor = 0.2
  }

  for (const stock of stocks) {
    const stock_state = await prisma.activeStock.findUnique({
      where: { stockId: stock.stockId }
    });

    if (!stock_state) continue;

    let ticks = stock_state?.regimeTicksLeft;

    const random = Math.random();

    let regime;

    let a = 0.25;
    let b = 0.60;

    if (Math.abs(stock_state?.momentumCounter) > 15) {
      if (stock_state?.regime === marketRegime.BULL) {
        a += 0.05;
        b += 0.1;
      }

      if (stock_state?.regime === marketRegime.BEAR) {
        a -= 0.05;
        b -= 0.1;
      }
    }

    if (stock_state?.regimeTicksLeft === 0) {
      ticks = (Math.random() * 80 + 40);
      if (random < a) {
        regime = marketRegime.SIDE;
      } else if (random > a && random < b) {
        regime = marketRegime.BEAR;
      } else {
        regime = marketRegime.BULL;
      }
    } else {
      ticks -= 1;
    }

    let volatilityMultiplier = stock_state?.volatilityMultiplier;
    if (Math.abs(stock_state?.lastReturn) > 0.01) {
      volatilityMultiplier = 1.5
    } else {
      if (volatilityMultiplier < 1) {
        volatilityMultiplier = 1
      } else {
        volatilityMultiplier *= 0.95;
      }
    }

    let effectiveVolatility = stock_state?.volatility * stock_state?.volatilityMultiplier * dampeningFactor!;


    const randomComponent = gaussian() * effectiveVolatility;
    let baseReturn = randomComponent + stock_state?.drift;

    if (regime === marketRegime.BEAR) {
      effectiveVolatility -= 0.001;
    } else if (regime === marketRegime.BULL) {
      effectiveVolatility += 0.0008;
    }

    baseReturn *= volatilityMultiplier;
    const nowString = new Date();
    const now = Date.now();

    let shockAllowed = true;

    if (stock_state.lastShockAt) {
      const shockCooldown = (now - stock_state?.lastShockAt.getTime());
      shockAllowed = shockCooldown >= 90000;
    }

    if (shockAllowed) {
      const random1 = Math.random();
      if (random1 <= 0.02) {
        let shockAmount = Math.random() * 0.07 + 0.03;
        const random3 = Math.random();
        if (regime === marketRegime.BULL) {
          if (random3 < 0.3) {
            shockAmount = -shockAmount;
          }
        } else if (regime === marketRegime.BEAR) {
          if (random3 > 0.3) {
            shockAmount = -shockAmount;
          } else {
            if (random3 > 0.5) {
              shockAmount = -shockAmount
            }
          }
        }
        baseReturn += shockAmount;
      }
    }


    const finalReturns = baseReturn * (stock_state?.liquidityFactor);

    let momentumCounter = stock_state?.momentumCounter;

    if (finalReturns > 0) {
      momentumCounter = momentumCounter >= 0
        ? momentumCounter + 1
        : 1
    } else if (finalReturns < 0) {
      momentumCounter = momentumCounter <= 0
        ? momentumCounter - 1
        : -1
    }

    const newPrice = stock.currentPrice * (1 + finalReturns);

    const dayHigh = Math.max(newPrice, stock.dayHigh);
    const dayLow = Math.min(newPrice, stock.dayLow);


    await prisma.$transaction([
      prisma.activeStock.update({
        where: { stockId: stock_state?.stockId },
        data: {
          regime,
          regimeTicksLeft: ticks,
          volatilityMultiplier,
          momentumCounter,
          lastReturn: finalReturns,
          lastShockAt: nowString
        }
      }),

      prisma.stock.update({
        where: { stockId: stock_state?.stockId },
        data: {
          currentPrice: newPrice,
          dayHigh: dayHigh,
          dayLow: dayLow
        }
      }),

      prisma.priceHistory.create({
        data: {
          stockId: stock_state.stockId,
          price: newPrice
        }
      })
    ]);
  }
}

export async function priceEngine() {
  const stocks = await prisma.stock.findMany();
  const marketStatus = await prisma.marketClock.findUnique({
    where: { id: 1 }
  });

  let marketTick = marketStatus?.currentMarketTick;
  let currentPhase = marketStatus?.currentPhase;
  let day = marketStatus?.days;

  if (marketStatus?.currentMarketTick === 1) {
    stocks.forEach(async (stock) => {
      await resetDayPrices(stock.currentPrice, stock.stockId);
    })
  }

  if (marketStatus?.currentMarketTick === 420) {
    currentPhase = marketPhase.CLOSED;
    stocks.forEach(async (stock) => {
      await prisma.stock.update({
        where: { stockId: stock.stockId },
        data: {
          previousClose: stock.currentPrice
        }
      });
    })
  } else if (marketStatus?.currentMarketTick === 600 && day) {
    currentPhase = marketPhase.OPEN;
    marketTick = 0;
    day += 1;
  }

  if (currentPhase && currentPhase !== marketPhase.CLOSED) {
    await updateStocks(stocks, currentPhase);
  }


  if (marketTick || marketTick === 0) {
    marketTick += 1
    await prisma.marketClock.update({
      where: { id: 1 },
      data: {
        currentMarketTick: marketTick,
        days: day,
        currentPhase
      }
    })
  }

  console.log(`Market Tick - ${marketTick}, Day - ${day}`)

}
