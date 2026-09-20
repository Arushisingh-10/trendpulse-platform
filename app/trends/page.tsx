import { Suspense } from "react";
import TrendsClient from "./TrendsClient";
import { getAllTrends } from "@/lib/trends";

export const metadata = { title: "Trending Topics | TrendPulse" };

export default async function TrendsPage() {
  const trends = await getAllTrends();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Trending Topics</h1>
      <p className="mt-1 text-sm text-gray-500">
        Ranked by 7-day view growth on Wikipedia. Updated from the latest available data.
      </p>
      <Suspense fallback={<p className="mt-8 text-gray-500">Loading...</p>}>
        <TrendsClient trends={trends} />
      </Suspense>
    </div>
  );
}