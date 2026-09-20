"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User, BarChart3, Lightbulb, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Sparkline from "./Sparkline";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.5 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.4 28.8c-.5-1.4-.8-3-.8-4.8s.3-3.3.8-4.8l-7.8-6C.9 16.4 0 20.100 0 24s.9 7.600 2.600 10.800l7.800-6z" />
      <path fill="#34A853" d="M24 48c6.200 0 11.400-2 15.200-5.500l-7.500-5.800c-2.100 1.400-4.700 2.300-7.700 2.300-6.400 0-11.700-4-13.600-9.800l-7.800 6C6.500 42.600 14.600 48 24 48z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12a12 12 0 1 0-13.900 11.900v-8.400H7.100V12h3V9.400c0-3 1.800-4.700 4.500-4.700 1.300 0 2.700.2 2.700.2v3h-1.500c-1.500 0-2 .9-2 1.900V12h3.400l-.5 3.500h-2.800v8.400A12 12 0 0 0 24 12z" />
    </svg>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [social, setSocial] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (isSignup && name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (isSignup && password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    const supabase = createClient();

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim() } },
      });
      setLoading(false);
      if (error) return setError(error.message);
      if (!data.session) return setInfo("Account created! Check your email to confirm, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function oauth(provider: "google" | "facebook") {
    setError("");
    setSocial(provider);
    const { error } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setSocial("");
      setError(error.message);
    }
  }

  const field =
    "flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100";
  const inputCls = "w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400";
  const socialBtn =
    "flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:opacity-60";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-indigo-50 via-violet-50 to-white px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-200/60 lg:grid-cols-2">
        {/* LEFT PANEL (sirf desktop par) */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-800 p-10 text-white lg:flex">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
                <Activity size={22} />
              </span>
              <span className="text-2xl font-bold">
                Trend<span className="text-indigo-300">Pulse</span>
              </span>
            </div>
            <p className="mt-1 text-sm text-indigo-200">Smarter Trends. Better Decisions.</p>

            <h2 className="mt-12 text-3xl font-bold leading-tight">
              {isSignup ? "Create Your Account" : "Turn Trends into"}
              <br />
              <span className="text-indigo-300">{isSignup ? "and start today" : "Your Advantage"}</span>
            </h2>
            <p className="mt-3 max-w-xs text-sm text-indigo-100/80">
              Explore real-time insights, analyze what matters and stay ahead with TrendPulse.
            </p>
          </div>

          <div className="relative mt-8">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/10">
              <p className="text-xs text-indigo-200">Total Growth</p>
              <p className="text-2xl font-bold text-emerald-300">↗ +12.5%</p>
              <Sparkline data={[3, 4, 4, 6, 5, 8, 9, 12, 14]} color="#a5b4fc" className="mt-2 h-24 w-full" />
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                { icon: BarChart3, t: "Real-time Analytics", s: "Stay updated with live trends" },
                { icon: Lightbulb, t: "Smart Insights", s: "Get data-driven recommendations" },
                { icon: ShieldCheck, t: "Personalized Experience", s: "Save trends and make informed decisions" },
              ].map(({ icon: Icon, t, s }) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block font-medium">{t}</span>
                    <span className="text-xs text-indigo-200">{s}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="p-6 sm:p-10">
          <p className="text-right text-sm text-gray-500">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-indigo-600 hover:underline">
              {isSignup ? "Log In" : "Sign Up"}
            </Link>
          </p>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">{isSignup ? "Create Your Account 🚀" : "Welcome Back 👋"}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isSignup ? "Start your journey with TrendPulse today." : "Log in to your TrendPulse account and continue exploring the latest trends."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {isSignup && (
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className={`${field} mt-1`}>
                  <User size={18} className="text-gray-400" />
                  <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className={`${field} mt-1`}>
                <Mail size={18} className="text-gray-400" />
                <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className={`${field} mt-1`}>
                <Lock size={18} className="text-gray-400" />
                <input type={show ? "text" : "password"} className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isSignup ? "Create a password" : "Enter your password"} />
                <button type="button" onClick={() => setShow(!show)} aria-label="Show or hide password" className="text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className={`${field} mt-1`}>
                  <Lock size={18} className="text-gray-400" />
                  <input type={show ? "text" : "password"} className={inputCls} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm your password" />
                </div>
              </div>
            )}

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            {info && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSignup ? "Sign Up" : "Log In"} {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" /> OR <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="space-y-3">
            <button onClick={() => oauth("google")} disabled={!!social} className={socialBtn}>
              {social === "google" ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />} Continue with Google
            </button>
            <button onClick={() => oauth("facebook")} disabled={!!social} className={socialBtn}>
              {social === "facebook" ? <Loader2 size={18} className="animate-spin" /> : <FacebookIcon />} Continue with Facebook
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}