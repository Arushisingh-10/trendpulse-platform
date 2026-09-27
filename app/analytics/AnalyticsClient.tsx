"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ScatterChart, Scatter,
} from "recharts";
import type { LiveTrend } from "@/lib/trends";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899", "#84cc16"];
const VELOCITY_COLORS: Record<string, string> = { Trending: "#ef4444", Rising: "#10b981", Stable: "#f59e0b", Declining: "#6b7280" };

export default function AnalyticsClient({ trends }: { trends: LiveTrend[] }) {
  const [selected, setSelected] = useState<string[]>(trends.slice(0, 4).map((t) => t.slug));

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : s.length < 5 ? [...s, slug] : s));

  // 1. Comparison chart: chuni hui trends ke last 30 din
  const comparisonData = useMemo(() => {
    const chosen = trends.filter((t) => selected.includes(t.slug));
    const len = Math.max(0, ...chosen.map((t) => t.data.length));
    const rows = [];
    for (let i = 0; i < len; i++) {
      const row: Record<string, number | string> = { i };
      chosen.forEach((t) => (row[t.name] = t.data[i] ?? 0));
      rows.push(row);
    }
    return { rows, chosen };
  }, [trends, selected]);

  // 2. Category distribution
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    trends.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [trends]);

  // 3. Top growing topics
  const topGrowing = useMemo(() => [...trends].sort((a, b) => b.growth - a.growth).slice(0, 5), [trends]);

  // 4. Velocity scatter: growth vs recent avg views
  const scatterData = useMemo(
    () => trends.map((t) => ({ name: t.name, growth: t.growth, views: t.recentAvg, status: t.status })),
    [trends]
  );

  return (
    <>
      {/* Trend selector */}
      <div className="mt-6 flex flex-wrap gap-2">
        {trends.map((t) => (
          <button
            key={t.slug}
            onClick={() => toggle(t.slug)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              selected.includes(t.slug) ? "bg-indigo-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-indigo-50"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-gray-400">Select up to 5 topics to compare.</p>

      {/* Comparison chart */}
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Trend Comparison</h2>
        <p className="mb-4 text-sm text-gray-500">Daily Wikipedia views, last 30 days</p>
        <div className="h-72 w-full sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData.rows} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="i" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              {comparisonData.chosen.map((t, i) => (
                <Line key={t.slug} type="monotone" dataKey={t.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Category distribution */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Category Distribution</h2>
          <p className="mb-2 text-sm text-gray-500">{trends.length} total trends tracked</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top growing */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Top Growing Topics</h2>
          <p className="mb-4 text-sm text-gray-500">Ranked by 7-day growth</p>
          <div className="space-y-3">
            {topGrowing.map((t) => {
              const pct = Math.min(100, Math.abs(t.growth));
              return (
                <div key={t.slug}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-800">{t.name}</span>
                    <span className={t.growth < 0 ? "text-red-500" : "text-emerald-600"}>
                      {t.growth > 0 ? "+" : ""}{t.growth}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${t.growth < 0 ? "bg-red-400" : "bg-indigo-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Velocity scatter */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Trend Velocity</h2>
        <p className="mb-4 text-sm text-gray-500">Growth rate vs average daily views (last 7 days)</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" dataKey="views" name="Avg Views" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis type="number" dataKey="growth" name="Growth %" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v) => v} />
              <Scatter data={scatterData} fill="#4f46e5">
                {scatterData.map((d, i) => <Cell key={i} fill={VELOCITY_COLORS[d.status] ?? "#4f46e5"} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
          {Object.entries(VELOCITY_COLORS).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /> {k}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}