import Link from "next/link";
import { Search, Rocket, Flame, LineChart, Users, Bookmark, MonitorSmartphone, ArrowRight } from "lucide-react";
import Sparkline from "@/components/Sparkline";
import TrendCard from "@/components/TrendCard";
import { popularSearches, fmtGrowth } from "@/lib/data";
import { getAllTrends } from "@/lib/trends";

const features = [
  { icon: Flame, color: "bg-rose-50 text-rose-500", title: "Real-Time Trend Discovery", text: "Find what's trending, rising or declining across multiple categories." },
  { icon: LineChart, color: "bg-emerald-50 text-emerald-600", title: "In-Depth Analysis", text: "Get historical data, trend velocity, keywords and related topics." },
  { icon: Users, color: "bg-violet-50 text-violet-600", title: "Creator & Topic Discovery", text: "Explore relevant creators and content categories (where available)." },
  { icon: Bookmark, color: "bg-pink-50 text-pink-500", title: "Save & Organize", text: "Keep track of important trends in your personal dashboard." },
  { icon: MonitorSmartphone, color: "bg-sky-50 text-sky-600", title: "Mobile Responsive", text: "Access insights anytime, anywhere, on any device." },
];

export default async function Home() {
  const trends = await getAllTrends();
  const top = [...trends].sort((a, b) => b.growth - a.growth).slice(0, 5);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm ring-1 ring-indigo-100">
              <Rocket size={15} /> Discover. Analyze. Stay Ahead.
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Discover What&apos;s <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Rising</span> Before It Goes Mainstream
            </h1>
            <p className="mt-5 max-w-lg text-base text-gray-600 sm:text-lg">
              TrendPulse helps you find <strong className="text-gray-900">emerging trends</strong>, track their growth,
              and discover the right creators, all in one place.
            </p>

            <form action="/trends" className="mt-8 flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-indigo-100/60 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search size={18} className="text-gray-400" />
                <input
                  name="q"
                  type="text"
                  placeholder="Search for a trend, topic, or keyword..."
                  className="w-full py-3 outline-none placeholder:text-gray-400"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-medium text-white transition hover:bg-indigo-700">
                <Search size={16} /> Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Popular searches:</span>
              {popularSearches.map((p) => (
                <Link key={p} href={`/trends?q=${p}`} className="rounded-full bg-white px-3 py-1 text-sm text-indigo-700 ring-1 ring-indigo-100 transition hover:bg-indigo-600 hover:text-white">
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="hidden md:block">
            <div className="rounded-3xl border border-white bg-white/70 p-4 shadow-2xl shadow-indigo-200/50 backdrop-blur">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">AI Agents</h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">Rising</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">+72%</p>
                  <Sparkline data={[2, 3, 3, 4, 5, 5, 7, 8, 8, 10, 12, 14]} className="mt-1 h-36 w-full" />
                  <div className="mt-1 flex justify-between text-xs text-gray-400">
                    <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                    <p className="text-xs text-gray-500">Trend Velocity</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">↗ Rising</p>
                    <p className="text-xs text-gray-500">+72% growth</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                    <p className="text-xs text-gray-500">Related Topics</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {["AI", "ML", "LLM"].map((t) => (
                        <span key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <Flame size={16} className="text-rose-500" /> Trending Now
                </p>
                <ul className="space-y-1.5 text-sm">
                  {top.map((t, i) => (
                    <li key={t.slug} className="flex justify-between text-gray-700">
                      <span>{i + 1}. {t.name}</span>
                      <span className="font-semibold text-emerald-600">{fmtGrowth(t.growth)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, color, title, text }) => (
            <div key={title}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING TOPICS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Flame className="text-rose-500" /> Trending Topics
              </h2>
              <p className="mt-1 text-sm text-gray-500">See what&apos;s gaining attention right now.</p>
            </div>
            <Link href="/trends" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trends.slice(0, 4).map((t) => (
              <TrendCard key={t.slug} t={t} />
            ))}
          </div>
        </div>
      </section>

     
    </>
  );
}