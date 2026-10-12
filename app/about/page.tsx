import { Activity, Database, Target, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata = { title: "About | TrendPulse" };

const sources = [
  { name: "Wikimedia Pageviews API", use: "Daily page views per topic — used to measure interest and compute trend velocity." },
  { name: "English Wikipedia", use: "Topic descriptions and article links for each tracked trend." },
];

const principles = [
  { icon: Database, title: "Transparent Data", text: "Every trend shows its exact data source and last update time, so you always know where the numbers come from." },
  { icon: Target, title: "Simple Methodology", text: "Trend velocity is calculated using a clear, explainable formula: 7-day average vs the previous 7-day average." },
  { icon: ShieldCheck, title: "Ethical by Design", text: "We never scrape Instagram, TikTok or other platforms in violation of their terms. Only official, permitted APIs are used." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Activity size={22} />
        </span>
        <h1 className="text-3xl font-bold text-gray-900">
          About Trend<span className="text-indigo-600">Pulse</span>
        </h1>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-gray-600">
        TrendPulse is a social trend intelligence platform that helps creators, marketers, startups and
        researchers discover which topics are genuinely emerging, not just already popular. Instead of showing
        raw popularity, TrendPulse measures how quickly interest in a topic is changing over time.
      </p>

      <h2 className="mt-12 text-xl font-bold text-gray-900">Why TrendPulse</h2>
      <p className="mt-2 text-gray-600">
        Most tools show what is currently popular. TrendPulse focuses on the question that matters more:
        what is becoming popular. By tracking daily interest over a rolling window, we can classify topics as
        Rising, Stable or Declining well before they peak.
      </p>

      <h2 className="mt-12 text-xl font-bold text-gray-900">How it works</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        {principles.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon size={20} />
            </span>
            <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold text-gray-900">Data Sources</h2>
      <div className="mt-4 space-y-3">
        {sources.map((s) => (
          <div key={s.name} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-medium text-gray-900">{s.name}</p>
            <p className="mt-1 text-sm text-gray-500">{s.use}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        TrendPulse does not scrape Instagram, TikTok, YouTube or any platform in violation of their terms of
        service. Wikipedia page views are used as a proxy for public interest, not a direct measure of
        social-media activity.
      </p>

      <h2 className="mt-12 text-xl font-bold text-gray-900">About this project</h2>
      <p className="mt-2 text-gray-600">
        TrendPulse was built as a 15-day Full Stack Development Internship project for PranavX Labs, covering
        research, system design, authentication, database design, real-data integration and deployment.
      </p>

      <a
        href="https://github.com/Arushisingh-10/trendpulse-platform"
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
       <ExternalLink size={16} /> View source on GitHub
      </a>
    </div>
  );
}