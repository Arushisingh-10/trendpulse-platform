"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import TrendCard from "@/components/TrendCard";
import { categories, type Trend } from "@/lib/data";

const sorts = [
  { value: "growth", label: "Growth" },
  { value: "score", label: "Trend Score" },
  { value: "name", label: "Name (A-Z)" },
];

export default function TrendsClient({ trends }: { trends: Trend[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("growth");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = trends.filter((t) => {
      const matchCat = category === "All" || t.category === category;
      const matchQ =
        !term ||
        t.name.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.tags.some((tag) => tag.toLowerCase().includes(term));
      return matchCat && matchQ;
    });
    return list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "score") return b.score - a.score;
      return b.growth - a.growth;
    });
  }, [q, category, sort, trends]);

  return (
    <>
      {/* Search + Sort */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search trends, topics or keywords..."
            className="w-full py-3 outline-none placeholder:text-gray-400"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>Sort by: {s.label}</option>
          ))}
        </select>
      </div>

      {/* Category chips (mobile par scroll honge) */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === c
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-indigo-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">{results.length} trends found</p>

      {/* Results */}
      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <TrendCard key={t.slug} t={t} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <SearchX size={40} className="text-gray-300" />
          <h3 className="mt-3 font-semibold text-gray-900">No trends found</h3>
          <p className="mt-1 text-sm text-gray-500">Try a different keyword or category.</p>
        </div>
      )}
    </>
  );
}