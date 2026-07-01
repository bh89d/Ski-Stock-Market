import { useState, useEffect } from "react";
import { getStockHistory, getSingleStock } from "../api/api.ts";
import type { StockDTO, stockHistoryDTO } from "../api/api.ts";
import type { ChartPoint } from "./chart.tsx";
import { CompanyChart } from "./chart.tsx";
import { tickToTime } from "../utils/util.ts";

const LIVE_WINDOW_SIZE = 60;

export function RenderGraph({ stockId, currentMarketTick }:
  {
    stockId: string
    currentMarketTick: number
  }) {
  const [prices, setPrices] = useState<number[]>([]);
  const [liveTick, setLiveTick] = useState<number>(currentMarketTick);

  useEffect(() => {
    setLiveTick(currentMarketTick);
  }, [currentMarketTick]);



  useEffect(() => {
    if (!stockId) return;

    let interval: ReturnType<typeof setInterval>;

    async function init() {

      const history = await getStockHistory(stockId);

      const formattedPrices = history.map((item: stockHistoryDTO) => item.price);

      setPrices(formattedPrices.slice(-LIVE_WINDOW_SIZE));

      interval = setInterval(async () => {
        const stock: StockDTO = await getSingleStock(stockId);

        setPrices(prev => {
          const updated = [...prev, stock.currentPrice];
          return updated.slice(-LIVE_WINDOW_SIZE);
        });

        setLiveTick((prev) => {
          if (prev >= 480) return 480;
          return prev + 1;
        });

      }, 1000);
    }

    init();

    return () => {
      if (interval) clearInterval(interval);
    };

  }, [stockId]);

  const chartData: ChartPoint[] = prices.map((price, index) => {
    const startTick = Math.max(liveTick - prices.length + 1, 0);
    const tick = startTick + index;

    return {
      tick,
      timeLabel: tickToTime(tick),
      price
    };
  });

  return (
    <div className="w-3/4 mb-10">
      <CompanyChart
        data={chartData}
      />
    </div>
  )
}