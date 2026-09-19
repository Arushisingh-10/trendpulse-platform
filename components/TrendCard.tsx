import Link from "next/link";
import { Bot, Code2, Car, GraduationCap, HeartPulse, Leaf, TrendingUp, TrendingDown } from "lucide-react";
import Sparkline from "./Sparkline";
import StatusBadge from "./StatusBadge";
import { fmtGrowth, type Trend } from "@/lib/data";

const icons: Record<string, React.ElementType> = {
  bot: Bot, code: Code2, car: Car, graduation: GraduationCap, heart: HeartPulse, leaf: Leaf,
};

export default function TrendCard({ t }: { t: Trend }) {
  const Icon = icons[t.icon] ?? Bot;
  const down = t.growth < 0;
  return (
    <Link
      href={`/trends/${t.slug}`}
      className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t.name}</h3>
            <p className={`flex items-center gap-1 text-sm font-medium ${down ? "text-red-500" : "text-emerald-600"}`}>
              {down ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {fmtGrowth(t.growth)}
            </p>
          </div>
        </div>
        <StatusBadge status={t.status} />
      </div>

      <Sparkline data={t.data} color={down ? "#ef4444" : "#4f46e5"} className="mt-4 h-14 w-full" />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {t.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{tag}</span>
          ))}
        </div>
        <span className="text-xs text-gray-400">Score {t.score}</span>
      </div>
    </Link>
  );
}