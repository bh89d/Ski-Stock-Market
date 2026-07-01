import { getSingleStockPortfolio, getUser, tradeStock, type companyWithStockDTO, type PortfolioItemDTO, type userDTO } from "../api/api.ts";
import { dayRangePosition } from "../utils/util.ts";
import { statisticalData } from "../data/data.ts";
import { Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";

type CurrenPriceProps = {
  company: companyWithStockDTO;
  change: number;
}

type CompanyWithStockDTOProp = {
  company: companyWithStockDTO;
}


export function CurrentPriceInfo({ company, change }: CurrenPriceProps) {
  return (
    <div className="pb-5 mb-5 flex justify-between">
      <div>
        <div className="text-5xl">
          {(company.stock.currentPrice).toFixed(2)}
        </div>
        <div className="text-2xl">
          %{change}
        </div>
      </div>
      <div>
        <div className="flex flex-col justify-center items-center">
          <div>
            Day Range
          </div>
          <div className="flex flex-row justify-center items-center">
            <p>{(company.stock.dayLow).toFixed(2)}</p>
            <div className="border-2 w-40 h-1 border-gray-400 border-dashed ml-4 mr-4 relative">
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full"
                style={{
                  left: `${dayRangePosition(
                    company.stock.currentPrice,
                    company.stock.dayHigh,
                    company.stock.dayLow
                  )}%`
                }}
              >
              </div>
            </div>
            <p>{(company.stock.dayHigh).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AnalyticalMetrics({ company }: CompanyWithStockDTOProp) {
  return (
    <>
      <p className="pb-5 text-4xl font-bold">Overview</p>
      <div className="grid grid-cols-6 gap-x-5 gap-y-2">
        {statisticalData(company).map((option) => {
          return (
            <Fragment key={option.field} >
              <p className="text-gray-500">{option.field}</p>
              <p className="font-semibold text-right">{(option.value).toFixed(2)}</p>
            </Fragment>
          );
        })}
      </div>
    </>
  )
}

export function TradePanel({ company }: CompanyWithStockDTOProp) {
  type BuyStep = "idle" | "input" | "confirm" | "processing" | "success";
  type SellStep = BuyStep;
  const [buyStep, setBuyStep] = useState<BuyStep>("idle");
  const [sellStep, setSellStep] = useState<SellStep>("idle");
  const [quantity, setQuantity] = useState<number>(0);
  const [user, setUser] = useState<userDTO>();
  const [error, setError] = useState<string | Error>("");
  const [balance, setBalance] = useState<number>();
  const [portfolio, setPortfolio] = useState<PortfolioItemDTO>();
  const [loading, setLoading] = useState<boolean>(true);

  const stockId = company.stock.stockId;

  const loadTradeData = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const userData = await getUser();
      setUser(userData);
      setBalance(userData.balance);

      const portfolioData = await getSingleStockPortfolio(stockId);
      setPortfolio(portfolioData);
      setError("");
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError("Could not fetch user data");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [stockId]);


  useEffect(() => {
    loadTradeData();
  }, [loadTradeData]);


  if (loading) {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65 justify-center items-center">
        <p> Loading trading data... </p>
      </div>);
  }

  if (!user) {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65 justify-center items-center">
        <p> Could not find user... </p>
      </div>);
  }


  const totalCost = quantity * company.stock.currentPrice;
  const currentBalance = balance ?? user.balance;
  const remainingBalance = currentBalance - totalCost;
  const errorMessage = error instanceof Error ? error.message : error;

  function handleStartSell() {
    if (!portfolio) {
      setError("You dont currently own any Stock of this company!")
      return;
    }
    setSellStep("input");
    setError("");
    setQuantity(portfolio?.quantity);
  }

  function handleStartBuy() {
    setError("");
    setQuantity(1);
    setBuyStep("input");
  }

  function handleNextFromInputSell() {
    if (quantity <= 0 || (portfolio && quantity > portfolio.quantity)) {
      setError("Enter valid quantity");
      return;
    }
    setError("");
    setSellStep("confirm");
  }

  async function handleConfirmSell(action: string) {
    try {
      setSellStep("processing");
      await tradeStock({ stockId, quantity, action });
      const refreshed = await loadTradeData();
      if (!refreshed) {
        setError("Trade succeeded, but refresh failed");
      }
      setSellStep("success");
    } catch (err) {
      setError("Trade Failed");
      setSellStep("confirm");
      return console.error(err);
    }
  }

  function handleBackToIdle() {
    setError("");
    setQuantity(0);
    setBuyStep("idle");
    setSellStep("idle");
  }

  function handleNextFromInput() {
    if (quantity <= 0) {
      setError("Enter a Valid Quantity");
      return;
    }
    if (remainingBalance < 0) {
      setError("Not enough Balance");
      return;
    }
    setError("");
    setBuyStep("confirm");
  }

  async function handleConfirmBuy(action: string) {
    try {
      setBuyStep("processing");
      await tradeStock({ stockId, quantity, action });
      const refreshed = await loadTradeData();
      if (!refreshed) {
        setError("Trade succeeded, but refresh failed");
      }

      setBuyStep("success");
    } catch (err) {
      setError("Trade Failed");
      setBuyStep("confirm");
      return console.error(err);
    }
  }


  if (buyStep === "idle" && sellStep === "idle") {
    return (
      <div className="flex flex-col items-center justify-center w-1/4 h-65">
        <button onClick={handleStartBuy}
          className="border-2 rounded-sm bg-green-500 p-2 pr-10 pl-10 cursor-pointer mb-5"
        > Buy </button>
        <button onClick={handleStartSell}
          className="border-2 rounded-sm bg-red-500 p-2 pr-10 pl-10 cursor-pointer mt-5"
        > Sell </button>
        {errorMessage && <p className="text-red-500 text-center text-8 pb-1 pt-1">{errorMessage}</p>}
      </div>
    );
  }

  if (sellStep === "input") {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65">
        <p className="pb-5 text-center"> Sell {company.companyName} Stocks</p>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p > Bought At : </p>
          <p> {(portfolio?.avgBuyPrice)?.toFixed(2)} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35 ">
          <p> Selling At : </p>
          <p> {(company.stock.currentPrice).toFixed(2)} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p className="pr-2"> Quantity : </p>
          <input
            className="w-10 border text-center rounded-sm"
            min={1}
            step={1}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Total : </p>
          <p> {(totalCost).toFixed(2)} </p>
        </div>
        {errorMessage && <p className="text-red-500 text-center text-8 pb-1 pt-1">{errorMessage}</p>}
        <button className="border rounded-sm bg-red-400 mb-2 mt-1 cursor-pointer" onClick={handleBackToIdle}> Back </button>
        <button className="border rounded-sm bg-green-400 cursor-pointer" onClick={handleNextFromInputSell}> Proceed </button>
      </div>
    );
  }

  if (buyStep === "input") {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65">
        <p className="pb-5 text-center"> Buy {company.companyName} Stocks</p>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p > Current Balance : </p>
          <p> {currentBalance} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35 ">
          <p> Buying At : </p>
          <p> {(company.stock.currentPrice).toFixed(2)} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p className="pr-2"> Quantity : </p>
          <input
            className="w-10 border text-center rounded-sm"
            min={1}
            step={1}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Total : </p>
          <p> {(totalCost).toFixed(2)} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Remaining Balance : </p>
          <p> {(remainingBalance).toFixed(2)} </p>
        </div>
        {errorMessage && <p className="text-red-500 text-center text-8 pb-1 pt-1">{errorMessage}</p>}
        <button className="border rounded-sm bg-red-400 mb-2 mt-1 cursor-pointer" onClick={handleBackToIdle}> Back </button>
        <button className="border rounded-sm bg-green-400 cursor-pointer" onClick={handleNextFromInput}> Proceed </button>
      </div>
    );
  }

  if (sellStep === "confirm") {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65">
        <p className="pb-5 text-center"> Confirmation : </p>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Name : </p>
          <p> {company.companyName} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Quantity : </p>
          <p> {quantity} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Total : </p>
          <p> {(totalCost).toFixed(2)} </p>
        </div>
        {errorMessage && <p className="text-red-500 text-center text-8 pb-1 pt-1">{errorMessage}</p>}
        <button className="border rounded-sm bg-green-400 cursor-pointer mt-2" onClick={() => handleConfirmSell("sell")}> Confirm </button>
        <button className="border rounded-sm cursor-pointer mt-1" onClick={() => setSellStep("input")}> Back </button>
        <button className="border rounded-sm cursor-pointer mt-1" onClick={handleBackToIdle}> Cancel </button>
      </div>
    );
  }

  if (buyStep === "confirm") {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65">
        <p className="pb-5 text-center"> Confirmation : </p>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Name : </p>
          <p> {company.companyName} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Quantity : </p>
          <p> {quantity} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Total : </p>
          <p> {(totalCost).toFixed(2)} </p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-400/35">
          <p> Remaining Balance : </p>
          <p> {(remainingBalance).toFixed(2)} </p>
        </div>
        {errorMessage && <p className="text-red-500 text-center text-8 pb-1 pt-1">{errorMessage}</p>}
        <button className="border rounded-sm bg-green-400 cursor-pointer mt-2" onClick={() => handleConfirmBuy("buy")}> Confirm </button>
        <button className="border rounded-sm cursor-pointer mt-1" onClick={() => setBuyStep("input")}> Back </button>
        <button className="border rounded-sm cursor-pointer mt-1" onClick={handleBackToIdle}> Cancel </button>
      </div>
    );
  }

  if (sellStep === "processing") {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65 justify-center items-center">
        <p> Processing trade... </p>
      </div>)
  }

  if (buyStep === "processing") {
    return (
      <div className="flex flex-col pl-4 pr-2 w-1/4 h-65 justify-center items-center">
        <p> Processing trade... </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col pl-4 pr-2 w-1/4 h-65 justify-center">
      <p className="text-center"> Trade successful ! </p>
      <button className="border rounded-sm cursor-pointer mt-2" onClick={handleBackToIdle}> Back </button>
    </div>
  );
}
