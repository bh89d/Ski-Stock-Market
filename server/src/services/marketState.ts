import type { StockWithCompanyDTO } from "../types/types.ts";

let stocks : StockWithCompanyDTO[] = [];
export function setStock(initialStock: StockWithCompanyDTO[] ) {
  stocks = initialStock;
}

export function getStock(){
  return stocks;
}