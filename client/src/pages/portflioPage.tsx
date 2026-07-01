import { useEffect, useState } from "react";
import { getPortfolio, type PortfolioItemDTO } from "../api/api";

export function UserPortfolio() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PortfolioItemDTO[]>();
  const [error, setError] = useState<string | Error>("");

  useEffect(() => {
    async function fetchPorfolio() {
      setLoading(true);
      try {
        const data = await getPortfolio();
        setData(data);
        setLoading(false);
      } catch {
        setError("Cannot fetch user portfolio right now");
      } finally {
        setLoading(false);
      }
    }
    fetchPorfolio();
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium text-slate-600">
        Loading Portfolio ...
      </div>
    )
  }

  if (error !== "") {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium text-red-500">
        Cannot fetch portfolio right now...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="pb-8 text-4xl font-bold text-slate-900">User Portfolio</p>

        {!data || data.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-lg text-slate-500 shadow-sm">
            No holdings yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] gap-4 border-b border-slate-200 px-8 py-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <div className="flex items-center justify-center">Company</div>
              <div className="flex items-center justify-center">Ticker</div>
              <div className="flex items-center justify-center">Current Price</div>
              <div className="flex items-center justify-center">Avg. Buy Price</div>
              <div className="flex items-center justify-center">Quantity</div>
            </div>

            {data.map((option, index) => {
              return (
                <div
                  key={option.portfolioId}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] gap-4 px-8 py-5 ${
                    index !== data.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div className="flex items-center justify-center text-center font-medium text-slate-900">
                    {option.stock.company.companyName}
                  </div>
                  <div className="flex items-center justify-center text-center text-slate-700">
                    {option.stock.tickerSymbol}
                  </div>
                  <div className="flex items-center justify-center text-center font-medium text-slate-900">
                    {option.stock.currentPrice.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-center text-center text-slate-700">
                    {option.avgBuyPrice?.toFixed(2) ?? "0.00"}
                  </div>
                  <div className="flex items-center justify-center text-center font-medium text-slate-900">
                    {option.quantity}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
