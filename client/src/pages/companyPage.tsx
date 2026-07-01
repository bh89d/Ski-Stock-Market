import { RenderGraph } from "../components/renderGraph";
import { CurrentPriceInfo, TradePanel } from "../components/companyPageComponents.tsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { CompanyStockTimeDTO } from "../api/api";
import { getSingleCompany } from "../api/api";
import { HeaderCompanyPage } from "../components/header";
import { percentageChange } from "../utils/util.ts";
import { AnalyticalMetrics } from "../components/companyPageComponents.tsx";
import { RenderLongGraph } from "../components/renderLongGraph.tsx";


export function CompanyPage() {
  const [data, setData] = useState<CompanyStockTimeDTO | null>(null);
  const { companyId } = useParams();
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    if (!companyId) return;

    let interval: ReturnType<typeof setInterval>;
    let data;
    let changeCalculator;

    try {
      async function initialFetch() {
        data = await getSingleCompany(companyId!);
        setData(data);
        changeCalculator = data.company.stock.previousClose === 0 ? 0 : percentageChange(data.company.stock.previousClose, data.company.stock.currentPrice);
        setChange(Number(changeCalculator));
      }

      initialFetch();

      function getCompany() {
        interval = setInterval(async () => {
          const data = await getSingleCompany(companyId!);
          const changeCalculator = data.company.stock.previousClose === 0 ? 0 : percentageChange(data.company.stock.previousClose, data.company.stock.currentPrice);
          setChange(Number(changeCalculator));
        }, 5000);
      }

      getCompany();
    } catch (err) {
      return console.error(err);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [companyId]);

  if (!companyId) {
    return <p>Invalid Company ID</p>;
  }


  if (!data) {
    return <p>Loading...</p>;
  }


  return (
    <div className="mt-25 pl-5 pr-5">
      <HeaderCompanyPage company={data.company} />
      <CurrentPriceInfo company={data.company} change={change} />
      <div className = "flex">
        <RenderGraph stockId={data.company.stock.stockId} currentMarketTick={data?.time.currentMarketTick} />
        <TradePanel company = {data.company} />
      </div>

      <AnalyticalMetrics company={data.company} />
      <RenderLongGraph
        stockId={data.company.stock.stockId}
        basePrice={data.company.stock.basePrice}
      />
    </div>
  );
}