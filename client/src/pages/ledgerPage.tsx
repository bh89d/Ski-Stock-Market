import { useEffect, useState } from "react";
import { getLedger, type LedgerItemDTO } from "../api/api";

export function UserLedger() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<LedgerItemDTO[]>();
  const [error, setError] = useState<string | Error>("");

  useEffect(() => {
    async function fetchLedger() {
      setLoading(true);
      try {
        const data = await getLedger();
        setData(data);
        setLoading(false);
      } catch {
        setError("Cannot fetch user transaction history right now");
      } finally {
        setLoading(false);
      }
    }
    fetchLedger();
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium text-slate-600">
        Loading transaction history ...
      </div>
    )
  }

  if (error !== "") {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium text-red-500">
        Cannot fetch transaction history right now...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="pb-8 text-4xl font-bold text-slate-900">Transactions</p>

        {!data || data.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-lg text-slate-500 shadow-sm">
            No transactions yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] gap-4 border-b border-slate-200 px-8 py-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <div className="flex items-center justify-center">Company</div>
              <div className="flex items-center justify-center">Transaction</div>
              <div className="flex items-center justify-center">Sold/Bought At</div>
              <div className="flex items-center justify-center">Quantity</div>
              <div className="flex items-center justify-center">Time</div>
            </div>

            {data.map((option, index) => {
              return (
                <div
                  key={option.id}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] gap-4 px-8 py-5 ${index !== data.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                >
                  <div className="flex items-center justify-center text-center font-medium text-slate-900">
                    {option.stock.company.companyName}
                  </div>
                  <div className={`flex items-center justify-center text-center ${option.transaction === "BUY" ? "text-green-500" : "text-red-500"}`}>
                    {option.transaction}
                  </div>
                  <div className="flex items-center justify-center text-center font-medium text-slate-900">
                    {(option.price).toFixed(2)}
                  </div>
                  <div className="flex items-center justify-center text-center text-slate-700">
                    {option.quantity}
                  </div>
                  <div className="flex items-center justify-center text-center font-medium text-slate-900">
                    {new Date(option.time).toLocaleString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })
                    }
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