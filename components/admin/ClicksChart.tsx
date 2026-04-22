"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { name: string; count: number };

export function ClicksChart({ data }: { data: Row[] }) {
  return (
    <div className="h-[280px] w-full rounded-xl border border-stroke/18 bg-white/85 p-3 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50 sm:h-[320px] sm:p-4">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-white">
        Клики по кнопкам (30 дней)
      </p>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="name" tick={{ fill: "var(--chart-tick)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--chart-tick-muted)", fontSize: 10 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 8,
              boxShadow: "0 12px 40px -20px rgba(0,0,0,0.25)",
            }}
            labelStyle={{ color: "var(--chart-tooltip-label)" }}
            itemStyle={{ color: "rgb(var(--accent-rgb))" }}
          />
          <Bar dataKey="count" fill="rgb(var(--accent-rgb))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
