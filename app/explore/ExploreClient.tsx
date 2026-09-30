"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Briefcase, HeartPulse, GraduationCap, Shirt, Trophy, Grid3x3 } from "lucide-react";
import TrendCard from "@/components/TrendCard";
import type { LiveTrend } from "@/lib/trends";

const categoryIcons: Record<string, React.ElementType> = {
  Tech: Bot, Business: Briefcase, Health: HeartPulse, Education: GraduationCap, Fashion: Shirt, Sports: Trophy,
};

export default function ExploreClient({ trends }: { trends: LiveTrend[] }) {
  const [category, setCategory] = useState<string | null>(null);

  // Category-wise counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    trends.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + 1));
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, [trends]);

  // Related topics cloud: sab related tags ikattha karke ginti
  const cloud = useMemo(() => {
    const map = new Map<string, number>();
    trends.forEach((t) => t.related.forEach((r) => map.set(r, (map.get(r) ?? 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, [trends]);

  const filtered = category ? trends.filter((t) => t.category === category) : trends;

  return (
    <>
      {/* Category grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <button
          onClick={() => setCategory(null)}
          className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
            category === null ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Grid3x3 size={20} />
          </span>
          <span className="text-sm font-medium text-gray-800">All</span>
          <span className="text-xs text-gray-400">{trends.length} topics</span>
        </button>

        {categories.map(({ name, count }) => {
          const Icon = categoryIcons[name] ?? Grid3x3;
          const active = category === name;
          return (
            <button
              key={name}
              onClick={() => setCategory(name)}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                active ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Icon size={20} />
              </span>
              <span className="text-sm font-medium text-gray-800">{name}</span>
              <span className="text-xs text-gray-400">{count} topics</span>
            </button>
          );
        })}
      </div>

      {/* Filtered results */}
      <h2 className="mt-10 text-xl font-bold text-gray-900">
        {category ? `${category} Topics` : "All Topics"}
      </h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TrendCard key={t.slug} t={t} />
        ))}
      </div>

      {/* Related topics cloud */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">Related Topics Cloud</h2>
        <p className="mt-1 text-sm text-gray-500">Explore topics connected to what&apos;s trending right now.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cloud.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/trends?q=${tag}`}
              className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-100"
              style={{ fontSize: `${Math.min(16, 12 + count)}px` }}
            >
              {tag} <span className="text-xs text-indigo-400">·{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}