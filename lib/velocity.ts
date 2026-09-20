import type { Status } from "./data";

// Methodology: pichhle 7 din ka average vs uske pehle ke 7 din ka average
export const RISING_THRESHOLD = 15;   // +15% ya zyada = Rising
export const TRENDING_THRESHOLD = 50; // +50% ya zyada = Trending (tez Rising)

const avg = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

export function computeVelocity(views: number[]) {
  const recentAvg = avg(views.slice(-7));
  const previousAvg = avg(views.slice(-14, -7));
  const growth = previousAvg === 0 ? 0 : Math.round(((recentAvg - previousAvg) / previousAvg) * 100);

  let status: Status = "Stable";
  if (growth >= TRENDING_THRESHOLD) status = "Trending";
  else if (growth >= RISING_THRESHOLD) status = "Rising";
  else if (growth <= -RISING_THRESHOLD) status = "Declining";

  return { growth, status, recentAvg: Math.round(recentAvg), previousAvg: Math.round(previousAvg) };
}

// Trend score (0-100): 50 se shuru, growth ke hisaab se upar/neeche
export function trendScore(growth: number) {
  return Math.max(0, Math.min(100, Math.round(50 + growth * 0.5)));
}