import {
  tickToTime,
  marketMinutesToTick,
  marketMinutesToTimeLabel
} from "../utils/util.ts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export type ChartPoint = {
  tick: number;
  timeLabel: string;
  price: number;
};

export type LongTermChartPoint = {
  time: number;
  price: number;
};

type LongTermChartProps = {
  data: LongTermChartPoint[];
};

type ChartProps = {
  data: ChartPoint[];
};

export function CompanyChart({ data }: ChartProps) {
  if (data.length === 0) {
    return <div className="h-65 flex items-center justify-center">Loading chart...</div>;
  }

  const minTick = data[0].tick;
  const maxTick = data[data.length - 1].tick;

  const OPEN_SESSION_TICKS = 480;
  const OPEN_SESSION_MINUTES = 420;
  const AXIS_INTERVAL_MINUTES = 15;

  const minVisibleMinutes = Math.floor((minTick / OPEN_SESSION_TICKS) * OPEN_SESSION_MINUTES);
  const maxVisibleMinutes = Math.ceil((maxTick / OPEN_SESSION_TICKS) * OPEN_SESSION_MINUTES);

  const firstAlignedMinutes =
    Math.ceil(minVisibleMinutes / AXIS_INTERVAL_MINUTES) * AXIS_INTERVAL_MINUTES;

  const tickLabels = new Map<number, string>();
  const tickSet = new Set<number>();

  for (
    let minutes = firstAlignedMinutes;
    minutes <= maxVisibleMinutes;
    minutes += AXIS_INTERVAL_MINUTES
  ) {
    const tick = marketMinutesToTick(minutes);

    if (tick >= minTick && tick <= maxTick) {
      tickSet.add(tick);
      tickLabels.set(tick, marketMinutesToTimeLabel(minutes));
    }
  }

  const xTicks = [...tickSet].sort((a, b) => a - b);

  if (xTicks.length === 0) {
    xTicks.push(minTick, maxTick);
    tickLabels.set(minTick, data[0].timeLabel);
    tickLabels.set(maxTick, data[data.length - 1].timeLabel);
  }

  const prices = data.map((point) => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const padding = Math.max(range * 0.15, 1);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="tick"
            type="number"
            domain={[minTick, maxTick]}
            ticks={xTicks}
            tickFormatter={(value) => {
              if (typeof value !== "number") return String(value);
              return tickLabels.get(value) ?? "";
            }}
          />

          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tickFormatter={(value) =>
              typeof value === "number" ? value.toFixed(2) : String(value)
            }
          />

          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? value.toFixed(2) : String(value)
            }
            labelFormatter={(value) => {
              if (typeof value !== "number") return String(value);
              return tickToTime(value);
            }}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LongTermChart({ data }: LongTermChartProps) {
  if (data.length === 0) {
    return <div className="h-80 flex items-center justify-center">Loading chart...</div>;
  }

  const sortedData = [...data].sort((a, b) => a.time - b.time);

  const prices = sortedData.map((point) => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const padding = Math.max(range * 0.1, 2);

  const minTime = sortedData[0].time;
  const maxTime = sortedData[sortedData.length - 1].time;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={sortedData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            type="number"
            domain={[minTime, maxTime]}
            tickFormatter={(value) => {
              if (typeof value !== "number") return String(value);
              return new Date(value).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short"
              });
            }}
          />

          <YAxis
            width={70}
            domain={[minPrice - padding, maxPrice + padding]}
            tickFormatter={(value) =>
              typeof value === "number" ? value.toFixed(2) : String(value)
            }
          />

          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? value.toFixed(2) : String(value)
            }
            labelFormatter={(value) => {
              if (typeof value !== "number") return String(value);
              return new Date(value).toLocaleString();
            }}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
