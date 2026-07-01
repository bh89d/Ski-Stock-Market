export function avgBuyPrice (oldPrice : number, oldQty : number, newPrice : number, newQty : number) {
  const buyPrice = ((oldPrice * oldQty) + (newPrice * newQty)) / (oldQty + newQty) ;
  return buyPrice;
}