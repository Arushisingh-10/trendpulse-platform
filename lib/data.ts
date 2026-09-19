export type Status = "Trending" | "Rising" | "Stable" | "Declining";

export type Trend = {
  slug: string;
  name: string;
  icon: string;
  status: Status;
  growth: number;
  score: number;
  category: string;
  tags: string[];
  data: number[];
};

export const trends: Trend[] = [
  { slug: "ai-agents", name: "AI Agents", icon: "bot", status: "Trending", growth: 72, score: 87, category: "Tech", tags: ["#AI", "#Automation", "#LLM"], data: [3, 4, 4, 6, 5, 8, 9, 12, 14] },
  { slug: "react-19", name: "React 19", icon: "code", status: "Rising", growth: 48, score: 76, category: "Tech", tags: ["#React", "#Frontend", "#WebDev"], data: [4, 4, 5, 5, 7, 8, 8, 10, 11] },
  { slug: "electric-vehicles", name: "Electric Vehicles", icon: "car", status: "Rising", growth: 32, score: 72, category: "Business", tags: ["#EV", "#Sustainability", "#Tech"], data: [5, 6, 5, 7, 8, 8, 9, 10, 11] },
  { slug: "edtech", name: "EdTech", icon: "graduation", status: "Trending", growth: 21, score: 68, category: "Education", tags: ["#Education", "#OnlineLearning"], data: [6, 5, 7, 7, 8, 9, 9, 11, 12] },
  { slug: "healthy-living", name: "Healthy Living", icon: "heart", status: "Rising", growth: 28, score: 62, category: "Health", tags: ["#Fitness", "#Health", "#Wellness"], data: [5, 5, 6, 7, 6, 8, 8, 9, 10] },
  { slug: "sustainable-fashion", name: "Sustainable Fashion", icon: "leaf", status: "Declining", growth: -12, score: 34, category: "Fashion", tags: ["#Fashion", "#Sustainability"], data: [10, 10, 9, 9, 8, 8, 7, 7, 6] },
];

export const popularSearches = ["AI", "Startups", "Fitness", "Education", "Fashion", "Technology"];

export const fmtGrowth = (n: number) => `${n > 0 ? "+" : ""}${n}%`;

export const categories = ["All", "Tech", "Business", "Health", "Education", "Fashion", "Sports"];


export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export const details: Record<string, { description: string; related: string[]; keywords: string[] }> = {
  "ai-agents": {
    description: "AI-powered agents that can perform tasks, make decisions, and interact with users autonomously.",
    related: ["AI", "Machine Learning", "Automation", "LLM", "Robotics"],
    keywords: ["#AIAgents", "#Automation", "#LLM", "#AI"],
  },
  "react-19": {
    description: "The latest major React release with new features for building modern web interfaces.",
    related: ["React", "Frontend", "Next.js", "JavaScript"],
    keywords: ["#React", "#Frontend", "#WebDev", "#JavaScript"],
  },
  "electric-vehicles": {
    description: "Vehicles powered by batteries instead of fuel, growing fast with clean-energy adoption.",
    related: ["Batteries", "Clean Energy", "Charging", "Automotive"],
    keywords: ["#EV", "#Sustainability", "#CleanEnergy"],
  },
  edtech: {
    description: "Technology used to improve teaching and learning, from online courses to AI tutors.",
    related: ["Online Learning", "AI Tutors", "Education", "Skills"],
    keywords: ["#EdTech", "#OnlineLearning", "#Education"],
  },
  "healthy-living": {
    description: "Interest in fitness, nutrition and mental wellness as part of everyday lifestyle.",
    related: ["Fitness", "Nutrition", "Wellness", "Yoga"],
    keywords: ["#Fitness", "#Health", "#Wellness"],
  },
  "sustainable-fashion": {
    description: "Fashion made with eco-friendly materials and ethical production practices.",
    related: ["Fashion", "Thrift", "Eco Friendly", "Slow Fashion"],
    keywords: ["#Fashion", "#Sustainability", "#Eco"],
  },
};

export const getTrend = (slug: string) => trends.find((t) => t.slug === slug);