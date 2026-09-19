import type { Status } from "@/lib/data";

const styles: Record<Status, string> = {
  Trending: "bg-rose-50 text-rose-600 ring-rose-200",
  Rising: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Stable: "bg-amber-50 text-amber-700 ring-amber-200",
  Declining: "bg-red-50 text-red-600 ring-red-200",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}