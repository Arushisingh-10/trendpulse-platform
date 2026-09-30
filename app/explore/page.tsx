import { Compass } from "lucide-react";
import { getAllTrends } from "@/lib/trends";
import ExploreClient from "./ExploreClient";

export const metadata = { title: "Explore | TrendPulse" };

export default async function ExplorePage() {
  const trends = await getAllTrends();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
        <Compass className="text-indigo-600" /> Explore Topics
      </h1>
      <p className="mt-1 text-sm text-gray-500">Browse trends by category, or dive into related topics.</p>

      <ExploreClient trends={trends} />
    </div>
  );
}