"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SaveButton({
  trendId,
  initialSaved,
  loggedIn,
}: {
  trendId: string;
  initialSaved: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    if (!loggedIn) return router.push("/login");
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setLoading(false);
      return router.push("/login");
    }

    const { error } = saved
      ? await supabase.from("saved_trends").delete().eq("trend_id", trendId).eq("user_id", auth.user.id)
      : await supabase.from("saved_trends").insert({ trend_id: trendId, user_id: auth.user.id });

    setLoading(false);
    if (error) return setError("Could not update. Please try again.");
    setSaved(!saved);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start sm:items-end">
      <button
        onClick={toggle}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:opacity-60 ${
          saved
            ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {saved ? "Saved" : "Save Trend"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}