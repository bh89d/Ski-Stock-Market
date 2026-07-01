import "dotenv/config";
/*
import prisma from "../server/src/config/db.ts";
import { marketPhase, marketRegime } from "@prisma/client";


import { getStockHistory } from "../client/src/api/api.ts";
import { industryType, marketRegime } from "@prisma/client";
import { register } from "module";

const company = [{
  companyName: "AlpineEdge Equipment",
  industry: industryType.EQUIPMENT,
  netWorth: 250000000,
  annualRevenue: 80000000,
  establishedAt: new Date("2005-03-15"),
  stock: {
    tickerSymbol: "ALB",
    basePrice: 120,
    currentPrice: 132,
    dayHigh: 138,
    dayLow: 118,
    allTimeHigh: 160,
    allTimeLow: 75,
    volatility: 2.8,
    liquidityFactor: 0.22
  }
}, {
  companyName: "FrostWear Apparel",
  industry: industryType.APPAREL,
  netWorth: 180000000,
  annualRevenue: 65000000,
  establishedAt: new Date("2010-09-22"),
  stock: {
    tickerSymbol: "FRW",
    basePrice: 95,
    currentPrice: 102,
    dayHigh: 110,
    dayLow: 90,
    allTimeHigh: 140,
    allTimeLow: 60,
    volatility: 3.2,
    liquidityFactor: 0.28
  }
}, {
  companyName: "SummitPeak Resorts",
  industry: industryType.RESORT,
  netWorth: 500000000,
  annualRevenue: 150000000,
  establishedAt: new Date("1998-01-12"),
  stock: {
    tickerSymbol: "SMP",
    basePrice: 300,
    currentPrice: 315,
    dayHigh: 325,
    dayLow: 295,
    allTimeHigh: 380,
    allTimeLow: 180,
    volatility: 1.6,
    liquidityFactor: 0.14
  }
}, {
  companyName: "SkyLift Infrastructure",
  industry: industryType.INFRASTRUCTURE,
  netWorth: 250000000,
  annualRevenue: 80000000,
  establishedAt: new Date("2002-06-30"),
  stock: {
    tickerSymbol: "SKL",
    basePrice: 180,
    currentPrice: 174,
    dayHigh: 190,
    dayLow: 170,
    allTimeHigh: 240,
    allTimeLow: 120,
    volatility: 1.9,
    liquidityFactor: 0.12
  }
}, {
  companyName: "SnowLogic Technologies",
  industry: industryType.TECHNOLOGY,
  netWorth: 220000000,
  annualRevenue: 75000000,
  establishedAt: new Date("2015-11-05"),
  stock: {
    tickerSymbol: "SNT",
    basePrice: 150,
    currentPrice: 168,
    dayHigh: 182,
    dayLow: 145,
    allTimeHigh: 210,
    allTimeLow: 70,
    volatility: 4.2,
    liquidityFactor: 0.38
  }
}]

const main = async () => {
  for (const option of company) {
    console.log("Seeding company");
    const existing = await prisma.company.upsert({
      where: {
        companyName: option.companyName,
      },
      update: {},
      create: {
        companyName: option.companyName,
        industry: option.industry,
        netWorth: option.netWorth,
        annualRevenue: option.annualRevenue,
        establishedAt: option.establishedAt
      }
    });
    console.log("company seeded, seeding stock now");

    await prisma.stock.upsert({
      where: { tickerSymbol: option.stock.tickerSymbol },
      update: {},
      create: {
        companyId: existing.companyId,
        tickerSymbol: option.stock.tickerSymbol,
        basePrice: option.stock.basePrice,
        currentPrice: option.stock.currentPrice,
        dayHigh: option.stock.dayHigh,
        dayLow: option.stock.dayLow,
        allTimeHigh: option.stock.allTimeHigh,
        allTimeLow: option.stock.allTimeLow,
        volatility: option.stock.volatility,
        liquidityFactor: option.stock.liquidityFactor
      }
    });
    console.log("stock seeded");
  }
}


const seedStock= [
  {
    regime: marketRegime.SIDE,
    regimeTicksLeft: 60,
    drift: 0,
    volatility: 0.002,
    volatilityMultiplier: 1,
    liquidityFactor: 0.8,
    momentumCounter: 0,
    lastReturn: 0,
    lastShockAt: null
  },
  {
    regime: marketRegime.BULL,
    regimeTicksLeft: 80,
    drift: 0.0008,
    volatility: 0.004,
    volatilityMultiplier: 1,
    liquidityFactor: 1,
    momentumCounter: 0,
    lastReturn: 0,
    lastShockAt: null
  },
  {
    regime: marketRegime.BULL,
    regimeTicksLeft: 50,
    drift: 0.001,
    volatility: 0.007,
    volatilityMultiplier: 1,
    liquidityFactor: 1.2,
    momentumCounter: 0,
    lastReturn: 0,
    lastShockAt: null
  },
  {
    regime: marketRegime.SIDE,
    regimeTicksLeft: 70,
    drift: 0,
    volatility: 0.005,
    volatilityMultiplier: 1,
    liquidityFactor: 1,
    momentumCounter: 0,
    lastReturn: 0,
    lastShockAt: null
  },
  {
    regime: marketRegime.BEAR,
    regimeTicksLeft: 65,
    drift: -0.0007,
    volatility: 0.0035,
    volatilityMultiplier: 1,
    liquidityFactor: 0.9,
    momentumCounter: 0,
    lastReturn: 0,
    lastShockAt: null
  }
];

async function seed() {
  const stocks = await prisma.stock.findMany();
  let i = 0;
  for (const stock of stocks) {
    console.log("Creating activeStock for:", stock.stockId);
    await prisma.activeStock.create({
      data: {
        stockId: stock.stockId,
        regime: seedStock[i].regime,
        regimeTicksLeft : seedStock[i].regimeTicksLeft,
        drift : seedStock[i].drift,
        volatility: seedStock[i].volatility,
        volatilityMultiplier: seedStock[i].volatilityMultiplier,
        liquidityFactor: seedStock[i].liquidityFactor,
        momentumCounter: seedStock[i].momentumCounter,
        lastReturn: seedStock[i].lastReturn,
        lastShockAt : new Date(0)
      }
    });
    i++
  }
}

seed();


async function seed() {
  await prisma.marketClock.create({
    data: {
      id: 1,
      currentPhase: marketPhase.CLOSED,
      currentMarketTick : 0,
      currentTime : new Date()
    }
  })
}

seed();

*/