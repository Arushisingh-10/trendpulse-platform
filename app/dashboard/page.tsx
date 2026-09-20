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

  const name = data.user.user_metadata?.full_name ?? data.user.email;

  const stats = [
    { icon: Bookmark, label: "Saved Trends", value: 0, color: "bg-indigo-50 text-indigo-600" },
    { icon: Eye, label: "Recently Viewed", value: 0, color: "bg-sky-50 text-sky-600" },
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

      <h2 className="mt-10 text-xl font-bold text-gray-900">Trending Topics</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trends.slice(0, 3).map((t) => (
          <TrendCard key={t.slug} t={t} />
        ))}
      </div>
    </div>
  );
}