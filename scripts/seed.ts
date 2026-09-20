import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Topic = {
  slug: string; name: string; category: string; wiki: string;
  description: string; keywords: string[]; related: string[]; icon: string;
};

const topics: Topic[] = [
  { slug: "ai-agents", name: "AI Agents", category: "Tech", wiki: "Intelligent_agent", icon: "bot",
    description: "AI-powered agents that can perform tasks, make decisions and interact autonomously.",
    keywords: ["#AIAgents", "#Automation", "#LLM"], related: ["AI", "Machine Learning", "Automation", "Robotics"] },
  { slug: "generative-ai", name: "Generative AI", category: "Tech", wiki: "Generative_artificial_intelligence", icon: "bot",
    description: "AI systems that create text, images, audio and code from prompts.",
    keywords: ["#GenAI", "#ChatGPT", "#LLM"], related: ["AI", "LLM", "Image Generation"] },
  { slug: "react", name: "React", category: "Tech", wiki: "React_(software)", icon: "code",
    description: "A popular JavaScript library for building modern user interfaces.",
    keywords: ["#React", "#Frontend", "#WebDev"], related: ["JavaScript", "Next.js", "Frontend"] },
  { slug: "electric-vehicles", name: "Electric Vehicles", category: "Business", wiki: "Electric_vehicle", icon: "car",
    description: "Vehicles powered by batteries, growing fast with clean-energy adoption.",
    keywords: ["#EV", "#Sustainability", "#CleanEnergy"], related: ["Batteries", "Clean Energy", "Automotive"] },
  { slug: "startups", name: "Startups", category: "Business", wiki: "Startup_company", icon: "rocket",
    description: "Newly founded companies building scalable products and services.",
    keywords: ["#Startup", "#Founder", "#Venture"], related: ["Venture Capital", "Entrepreneurship"] },
  { slug: "edtech", name: "EdTech", category: "Education", wiki: "Educational_technology", icon: "graduation",
    description: "Technology used to improve teaching and learning, from online courses to AI tutors.",
    keywords: ["#EdTech", "#OnlineLearning"], related: ["Online Learning", "E-learning", "Skills"] },
  { slug: "online-learning", name: "Online Learning", category: "Education", wiki: "Educational_technology", icon: "graduation",
    description: "Learning delivered over the internet through courses and platforms.",
    keywords: ["#eLearning", "#MOOC"], related: ["EdTech", "Skills"] },
  { slug: "physical-fitness", name: "Physical Fitness", category: "Health", wiki: "Physical_fitness", icon: "heart",
    description: "Exercise, strength and overall physical wellbeing.",
    keywords: ["#Fitness", "#Workout", "#Health"], related: ["Nutrition", "Yoga", "Wellness"] },
  { slug: "mental-health", name: "Mental Health", category: "Health", wiki: "Mental_health", icon: "heart",
    description: "Emotional and psychological wellbeing and its awareness.",
    keywords: ["#MentalHealth", "#Wellness"], related: ["Therapy", "Mindfulness"] },
  { slug: "sustainable-fashion", name: "Sustainable Fashion", category: "Fashion", wiki: "Sustainable_fashion", icon: "leaf",
    description: "Fashion made with eco-friendly materials and ethical production.",
    keywords: ["#Fashion", "#Sustainability"], related: ["Slow Fashion", "Thrift"] },
  { slug: "cricket", name: "Cricket", category: "Sports", wiki: "Cricket", icon: "trophy",
    description: "A bat-and-ball sport with a huge fan base worldwide.",
    keywords: ["#Cricket", "#IPL"], related: ["IPL", "T20"] },
  { slug: "cryptocurrency", name: "Cryptocurrency", category: "Business", wiki: "Cryptocurrency", icon: "code",
    description: "Digital currencies secured by cryptography and blockchains.",
    keywords: ["#Crypto", "#Bitcoin"], related: ["Bitcoin", "Blockchain"] },
];

const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");

async function fetchViews(title: string, start: string, end: string) {
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(title)}/daily/${start}/${end}`;
  const res = await fetch(url, { headers: { "User-Agent": "TrendPulse-Internship/1.0 (student project)" } });
  if (!res.ok) throw new Error(`Wikipedia ${res.status} for ${title}`);
  const json = await res.json();
  return (json.items as { timestamp: string; views: number }[]).map((i) => ({
    date: `${i.timestamp.slice(0, 4)}-${i.timestamp.slice(4, 6)}-${i.timestamp.slice(6, 8)}`,
    views: i.views,
  }));
}

async function main() {
  const end = new Date(Date.now() - 2 * 86400000); // 2 din pehle tak (Wikipedia delay)
  const start = new Date(end.getTime() - 90 * 86400000);

  for (const t of topics) {
    try {
      const { data: trend, error } = await supabase
        .from("trends")
        .upsert(
          { slug: t.slug, name: t.name, category: t.category, description: t.description,
            wiki_title: t.wiki, keywords: t.keywords, related: t.related, icon: t.icon },
          { onConflict: "slug" }
        )
        .select("id")
        .single();
      if (error) throw error;

      const rows = (await fetchViews(t.wiki, fmt(start), fmt(end))).map((r) => ({ ...r, trend_id: trend.id }));
      const { error: hErr } = await supabase.from("trend_history").upsert(rows, { onConflict: "trend_id,date" });
      if (hErr) throw hErr;

      console.log(`OK  ${t.name}: ${rows.length} days`);
    } catch (e) {
      console.error(`FAIL ${t.name}:`, e);
    }
  }
  console.log("Done.");
}

main();