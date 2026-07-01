import type { companyWithStockDTO } from "../api/api.ts";
import { getCompanyAge } from "../utils/util.ts";

export function statisticalData(company: companyWithStockDTO) {

  const companyAge = getCompanyAge(company.establishedAt);

  const dayChange = company.stock.currentPrice - company.stock.previousClose;

  const dayChangePercent = company.stock.previousClose === 0
    ? 0
    : (dayChange / company.stock.previousClose) * 100

  const dayRangeWidth = company.stock.dayHigh - company.stock.dayLow;

  const dayRangePosition = company.stock.dayHigh === company.stock.dayLow
    ? 0
    : ((company.stock.currentPrice - company.stock.dayLow) / (company.stock.dayHigh - company.stock.dayLow)) * 100;

  const allTimeRangeWidth = company.stock.allTimeHigh - company.stock.allTimeLow;

  const allTimeRangePosition = company.stock.allTimeHigh === company.stock.allTimeLow
    ? 0
    : ((company.stock.currentPrice - company.stock.allTimeLow) / (company.stock.allTimeHigh - company.stock.allTimeLow)) * 100

  const distanceFromAllTimeHighper = company.stock.allTimeHigh === 0
    ? 0
    : ((company.stock.allTimeHigh - company.stock.currentPrice) / company.stock.allTimeHigh) * 100

  const revenueToNetworthRatio = company.netWorth === 0
    ? 0
    : company.annualRevenue / company.netWorth

  const info = [
    { field: "Current Price", value: company.stock.currentPrice },
    { field: "Previous Close", value: company.stock.previousClose },
    { field: "Day High", value: company.stock.dayHigh },


    { field: "Day Low", value: company.stock.dayLow },
    { field: "All-Time High", value: company.stock.allTimeHigh },
    { field: "All-Time Low", value: company.stock.allTimeLow },


    { field: "Volume", value: company.stock.volume },
    { field: "Company Age", value: companyAge },
    { field: "Day Change", value: dayChange },

    { field: "Day Change%", value: dayChangePercent },
    { field: "Day Range Width", value: dayRangeWidth },
    { field: "Day Range Position", value: dayRangePosition },

    { field: "All-Time Range Width", value: allTimeRangeWidth },
    { field: "All-Time Range Position", value: allTimeRangePosition },
    { field: "Distance From All-Time High %", value: distanceFromAllTimeHighper },

    { field: "Net Worth", value: company.netWorth },
    { field: "Annual Revenue", value: company.annualRevenue },
    { field: "Revenue to Net Worth Ratio", value: revenueToNetworthRatio }
  ];

  return info;
}