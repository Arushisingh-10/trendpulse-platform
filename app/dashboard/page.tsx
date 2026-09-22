import { redirect } from "next/navigation";
import { Bookmark, Eye, Flame, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import TrendCard from "@/components/TrendCard";
import { getAllTrends } from "@/lib/trends";

export const metadata = { title: "Dashboard | TrendPulse" };

export default async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const trends = await getAllTrends();

  const { data: savedRows } = await supabase.from("saved_trends").select("trend_id").eq("user_id", data.user.id);
const savedIds = new Set((savedRows ?? []).map((r) => r.trend_id));
const savedTrends = trends.filter((t) => savedIds.has(t.id));

const { data: viewRows } = await supabase
  .from("recent_views").select("trend_id, viewed_at")
  .eq("user_id", data.user.id).order("viewed_at", { ascending: false }).limit(20);
const recentIds = [...new Set((viewRows ?? []).map((r) => r.trend_id))].slice(0, 6);
const recent = recentIds.map((id) => trends.find((t) => t.id === id)).filter(Boolean) as typeof trends;

  const name = data.user.user_metadata?.full_name ?? data.user.email;

  const stats = [
    { icon: Bookmark, label: "Saved Trends", value: savedTrends.length, color: "bg-indigo-50 text-indigo-600" },
    { icon: Eye, label: "Recently Viewed", value: recentIds.length, color: "bg-sky-50 text-sky-600" },
    { icon: Flame, label: "Trending Topics", value: trends.length, color: "bg-rose-50 text-rose-500" },
    { icon: Activity, label: "Research Activity", value: 0, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {name}! 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Here&apos;s what&apos;s happening with your trends.</p>
        </div>
        <SignOutButton />
      </div>

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-gray-900">Saved Trends</h2>
      {savedTrends.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedTrends.map((t) => <TrendCard key={t.slug} t={t} />)}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          You haven&apos;t saved any trends yet. Open a trend and tap &quot;Save Trend&quot;.
        </p>
      )}

      {recent.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold text-gray-900">Recently Viewed</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((t) => <TrendCard key={t.slug} t={t} />)}
          </div>
        </>
      )}

      <h2 className="mt-10 text-xl font-bold text-gray-900">Top Rising Now</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trends.slice(0, 3).map((t) => <TrendCard key={t.slug} t={t} />)}
      </div>
    </div>
  );
}