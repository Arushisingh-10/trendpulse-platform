import { createClient } from "@/lib/supabase/server";
import type { Trend } from "./data";
import { computeVelocity, trendScore } from "./velocity";

export type LiveTrend = Trend & {
  id: string;
  description: string;
  related: string[];
  keywords: string[];
  dates: string[];
  lastDate: string;
  wikiTitle: string;
  recentAvg: number;
  previousAvg: number;
};

type Row = {
  id: string; slug: string; name: string; category: string; description: string | null;
  wiki_title: string; keywords: string[] | null; related: string[] | null; icon: string | null;
};

type Client = Awaited<ReturnType<typeof createClient>>;

async function build(supabase: Client, row: Row): Promise<LiveTrend> {
  const { data, error } = await supabase
    .from("trend_history")
    .select("date, views")
    .eq("trend_id", row.id)
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);

  const history = data ?? [];
  const views = history.map((h) => h.views as number);
  const v = computeVelocity(views);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon ?? "bot",
    category: row.category,
    status: v.status,
    growth: v.growth,
    score: trendScore(v.growth),
    tags: row.keywords ?? [],
    data: views.slice(-30), // card ke chhote graph ke liye last 30 din
    description: row.description ?? "",
    related: row.related ?? [],
    keywords: row.keywords ?? [],
    dates: history.map((h) => h.date as string),
    lastDate: history.length ? (history[history.length - 1].date as string) : "",
    wikiTitle: row.wiki_title,
    recentAvg: v.recentAvg,
    previousAvg: v.previousAvg,
  };
}

// Full history chart ke liye: data ko poore 90 din se replace karte hain
function withFullHistory(t: LiveTrend, views: number[]): LiveTrend {
  return { ...t, data: views };
}

export async function getAllTrends(): Promise<LiveTrend[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trends").select("*");
  if (error) throw new Error(error.message);
  const list = await Promise.all((data as Row[]).map((r) => build(supabase, r)));
  return list.sort((a, b) => b.growth - a.growth);
}

export async function getTrendBySlug(slug: string): Promise<LiveTrend | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trends").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const t = await build(supabase, data as Row);
  const { data: hist } = await supabase
    .from("trend_history").select("views").eq("trend_id", (data as Row).id).order("date", { ascending: true });
  return withFullHistory(t, (hist ?? []).map((h) => h.views as number));
}