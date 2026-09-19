import { Suspense } from "react";
import TrendsClient from "./TrendsClient";

export const metadata = { title: "Trending Topics | TrendPulse" };

export default function TrendsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Trending Topics</h1>
      <p className="mt-1 text-sm text-gray-500">Live trends from around the world. Updated in real-time.</p>
      <Suspense fallback={<p className="mt-8 text-gray-500">Loading...</p>}>
        <TrendsClient />
      </Suspense>
    </div>
  );
}