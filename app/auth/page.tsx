"use client";
import { useState } from "react";
import { getSupabaseClient } from "../../src/lib/supabase";
import { Brain, Mail, Lock, Eye, EyeOff, Facebook, Apple, Github, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
      }
      window.location.href = "/dashboard/student";
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data, error: err } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard/student` : undefined } });
      if (err) throw err;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message ?? "OAuth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center px-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/30 blur-3xl rounded-full" />

        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="text-white font-semibold">Smart Learning</div>
          </div>

          <div className="flex p-1 bg-white/10 rounded-full text-sm text-white/80 mb-6">
            <button onClick={() => setMode("signin")} className={`flex-1 px-4 py-2 rounded-full transition-all ${mode === 'signin' ? 'bg-white/20' : ''}`}>Sign In</button>
            <button onClick={() => setMode("signup")} className={`flex-1 px-4 py-2 rounded-full transition-all ${mode === 'signup' ? 'bg-white/20' : ''}`}>Sign Up</button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="your password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <div className="text-sm text-rose-300">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-2 text-xs text-white/60">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => oauth('google')} className="rounded-xl bg-white text-gray-800 px-3 py-2 hover:opacity-90">
                <svg viewBox="0 0 48 48" className="h-5 w-5 mx-auto">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.9 29.3 36 24 36 16.8 36 11 30.2 11 23s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.7 4.3 29.6 2 24 2 12.3 2 3 11.3 3 23s9.3 21 21 21c11.5 0 20.8-9.3 20.8-20.8 0-1.4-.1-2.7-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16.6 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.7 4.3 29.6 2 24 2 16.1 2 9.2 6.1 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29 34.6 26.6 35.5 24 35.5c-5.2 0-9.6-3.5-11.3-8.2l-6.5 5C9.2 41.9 16.1 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.4 5.7-6.4 7.5l.1.1 6.3 5.3c-.4.3 7.7-4.7 7.7-14.9 0-1.4-.1-2.7-.4-3.9z"/>
                </svg>
              </button>
              <button onClick={() => oauth('apple')} className="rounded-xl bg-white text-gray-800 px-3 py-2 hover:opacity-90">
                <Apple className="h-5 w-5 mx-auto" />
              </button>
              <button onClick={() => oauth('facebook')} className="rounded-xl bg-white text-gray-800 px-3 py-2 hover:opacity-90">
                <Facebook className="h-5 w-5 mx-auto" />
              </button>
            </div>

            <div className="text-xs text-white/60 text-center mt-3">
              By continuing you agree to our <Link href="#" className="underline">Terms</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




