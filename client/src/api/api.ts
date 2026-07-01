import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export async function getCompany() {
  const response = await api.get("/company");
  return response.data.data;
}

export async function getSingleStock(stockId: string) {
  const response = await api.get(`/stock/${stockId}`);
  return response.data.data;
}

export async function getStocks() {
  const response = await api.get(`/stock`);
  return response.data.data;
}

export async function getStockHistory(id: string) {
  const response = await api.get(`/stock/${id}/history`);
  return response.data.data;
}

export async function getSingleCompany(companyId: string) {
  const response = await api.get(`/company/${companyId}`);
  return response.data.data;
}

export async function getPortfolio() {
  const response = await api.get(`/portfolio`)
  return response.data.data;
}

export async function getLedger() {
  const response = await api.get(`/portfolio/ledger`);
  return response.data.data;
}

export async function tradeStock({ stockId, quantity, action } : tradeStockDTO) {
  const response = await api.post(action === "sell" ? "trade/sell" : "trade/buy", {
    stockId,
    quantity
  });
  return response.data.data;
}

export async function getUser() {
  const response = await api.get(`/user/me`);
  return response.data.data;
}

export async function registerUser({username, password, email} : registerUserDTO) {
  const response = await api.post("/home/register",
    {
      username,
      password,
      email
    }
  );
  return response.data.data;
}

export async function loginUser({username, password} : loginUserDTO) {
  const response = await api.post("/home/login",{
    username, password
  });
  return response.data;
}

export async function getSingleStockPortfolio(stockId : string) {
  const response = await api.post("/portfolio/stock",{
    stockId
  });
  return response.data.data;
}

export async function getMarketClock() {
  const response = await api.get("/market/clock");
  return response.data;
}


export type loginUserDTO = {
  username : string, 
  password : string
}
export type registerUserDTO = {
  username : string,
  password : string,
  email : string
}

export type tradeStockDTO = {
  stockId : string
  quantity : number
  action : string
}

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

export type stockHistoryDTO = {
  price: number
  createdAt: string
}

export type companyDTO = {
  companyId: string
  companyName: string
  industry: string
  netWorth: number
  annualRevenue: number
  establishedAt: string
}

export type companyWithStockDTO = {
  companyId: string
  companyName: string
  industry: string
  netWorth: number
  annualRevenue: number
  establishedAt: string
  stock: StockDTO
}

export type PortfolioItemDTO = {
  portfolioId: string
  avgBuyPrice: number
  quantity: number
  stock : {
    stockId : string
    tickerSymbol : string
    currentPrice : number
    company : {
      companyName : string
    }
  }
}

export type marketClockDTO = {
  id : number
  currentPhase : string
  currentMarketTick : number
  currentTime : string
  days : number

}

export type LedgerItemDTO = {
  id: string
  stockId: string
  userId: string
  transaction: "BUY" | "SELL"
  quantity: number
  avgBuyPrice: number | null
  price: number
  time: string
  stock: StockDTO & {
    company: Omit<companyDTO, "companyId">
  }
}

export type CompanyStockTimeDTO = {
  company : companyWithStockDTO
  time : marketClockDTO
}

export type userDTO = {
  userId : string,
  username : string,
  balance : number
}
