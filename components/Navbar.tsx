"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Menu, X, Search } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/trends", label: "Trending" },
  { href: "/explore", label: "Explore" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await createClient().auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Activity size={20} />
          </span>
          <span className="text-xl font-bold text-gray-900">
            Trend<span className="text-indigo-600">Pulse</span>
          </span>
        </Link>

        <div className="hidden h-full items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex h-full items-center border-b-2 text-sm font-medium transition ${
                active(l.href) ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/trends" aria-label="Search" className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <Search size={20} />
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
                Dashboard
              </Link>
              <button onClick={logout} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
                Log in
              </Link>
              <Link href="/signup" className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-gray-700 lg:hidden" aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="space-y-1 border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                active(l.href) ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-xl border border-gray-300 px-3 py-2.5 text-center text-sm font-medium">Dashboard</Link>
                <button onClick={logout} className="rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl border border-gray-300 px-3 py-2.5 text-center text-sm font-medium">Log in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-xl bg-indigo-600 px-3 py-2.5 text-center text-sm font-medium text-white">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}