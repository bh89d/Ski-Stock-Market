export type StockDTO = {
  allTimeHigh: number
  allTimeLow: number
  basePrice: number
  companyId: string
  currentPrice: number
  dayHigh: number
  dayLow: number
  previousClose: number
  stockId: string
  tickerSymbol: string
  volume: number
}

export type companyDTO = {
  companyId: string,
  companyName: string,
  industry: string,
  netWorth: number,
  annualRevenue: number,
  establishedAt: string
}

export type StockWithCompanyDTO = {
  allTimeHigh: number
  allTimeLow: number
  basePrice: number
  companyId: string
  currentPrice: number
  dayHigh: number
  dayLow: number
  previousClose: number
  stockId: string
  tickerSymbol: string
  volume: number
  company : companyDTO
}