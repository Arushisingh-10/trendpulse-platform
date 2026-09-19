import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, Database, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import TrendChart from "@/components/TrendChart";
import { details, fmtGrowth, getTrend, months } from "@/lib/data";

export default async function TrendDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTrend(slug);
  if (!t) notFound();

  const info = details[slug];
  const down = t.growth < 0;
  const velocity = down ? "Negative" : t.growth >= 50 ? "High" : t.growth >= 20 ? "Medium" : "Low";

  const stats = [
    { label: "Trend Score", value: `${t.score} / 100` },
    { label: "Growth", value: fmtGrowth(t.growth), color: down ? "text-red-500" : "text-emerald-600" },
    { label: "Velocity", value: velocity, color: down ? "text-red-500" : "text-emerald-600" },
    { label: "Status", value: t.status, color: down ? "text-red-500" : "text-emerald-600" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/trends" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to trends
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{t.name}</h1>
            <StatusBadge status={t.status} />
          </div>
          <p className="mt-2 max-w-xl text-gray-600">{info?.description}</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Bookmark size={16} /> Save Trend
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`mt-1 text-xl font-bold ${s.color ?? "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Historical Interest</h2>
        <p className="mb-4 text-sm text-gray-500">Relative interest over the last 9 months</p>
        <TrendChart data={t.data} labels={months} color={down ? "#ef4444" : "#4f46e5"} />
      </div>

      {/* Related + keywords */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">Related Topics</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {info?.related.map((r) => (
              <Link
                key={r}
                href={`/trends?q=${r}`}
                className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-100"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">Top Keywords</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {info?.keywords.map((k) => (
              <span key={k} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">{k}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Data source */}
      <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <Database size={16} className="text-indigo-600" /> Data source: Demo dataset (will be replaced by Wikipedia Pageviews API)
        </span>
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-indigo-600" /> Last updated: Sep 19, 2026
        </span>
      </div>
    </div>
  );
}