import { useEffect, useState } from "react";
import type { stockHistoryDTO } from "../api/api.ts";
import { getStockHistory } from "../api/api.ts";
import { LongTermChart } from "./chart.tsx";
import type { LongTermChartPoint } from "./chart.tsx";

export function RenderLongGraph({
  stockId,
  basePrice
}: {
  stockId: string;
  basePrice: number;
}) {
  const [data, setData] = useState<LongTermChartPoint[]>([]);

  useEffect(() => {
    if (!stockId) return;

    async function loadHistory() {
      const history = await getStockHistory(stockId);

      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const dayMs = 24 * 60 * 60 * 1000;

      const realHistory: LongTermChartPoint[] = history
        .map((item: stockHistoryDTO) => ({
          time: new Date(item.createdAt).getTime(),
          price: item.price
        }))
        .filter((point: LongTermChartPoint) => point.time >= sevenDaysAgo)
        .sort((a: LongTermChartPoint, b: LongTermChartPoint) => a.time - b.time);

      const hasEnoughHistory = realHistory.length >= 20;

      if (!hasEnoughHistory) {
        const latestPrice =
          realHistory.length > 0 ? realHistory[realHistory.length - 1].price : basePrice;

        const fallbackData: LongTermChartPoint[] = [
          { time: sevenDaysAgo, price: basePrice },
          { time: sevenDaysAgo + 1 * dayMs, price: basePrice },
          { time: sevenDaysAgo + 2 * dayMs, price: basePrice },
          { time: sevenDaysAgo + 3 * dayMs, price: basePrice },
          { time: sevenDaysAgo + 4 * dayMs, price: basePrice },
          { time: sevenDaysAgo + 5 * dayMs, price: basePrice },
          { time: sevenDaysAgo + 6 * dayMs, price: basePrice },
          { time: now, price: latestPrice }
        ];

        setData(fallbackData);
        return;
      }

      setData(realHistory);
    }

    loadHistory();
  }, [stockId, basePrice]);

  return (
    <div className="mt-10">
      <p className="pb-10 text-4xl font-bold">Long term trends</p>
      <LongTermChart data={data} />
    </div>);
}
