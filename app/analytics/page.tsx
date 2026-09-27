import { BarChart3 } from "lucide-react";
import { getAllTrends } from "@/lib/trends";
import AnalyticsClient from "./AnalyticsClient";

export const metadata = { title: "Analytics | TrendPulse" };

export default async function AnalyticsPage() {
  const trends = await getAllTrends();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
        <BarChart3 className="text-indigo-600" /> Trend Analytics
      </h1>
      <p className="mt-1 text-sm text-gray-500">Compare trends, explore insights and make data-driven decisions.</p>

      <AnalyticsClient trends={trends} />
    </div>
  );
}