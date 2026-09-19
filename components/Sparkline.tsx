import { useId } from "react";

export default function Sparkline({
  data,
  color = "#4f46e5",
  className = "",
  area = true,
}: {
  data: number[];
  color?: string;
  className?: string;
  area?: boolean;
}) {
  const id = useId();
  const w = 100;
  const h = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - 3 - ((v - min) / (max - min || 1)) * (h - 8);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <polygon points={`0,${h} ${line} ${w},${h}`} fill={`url(#${id})`} />}
      <polyline points={line} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}