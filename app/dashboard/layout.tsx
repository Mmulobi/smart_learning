"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { getSupabaseClient } from "../../src/lib/supabase";
import { useEffect, useState } from "react";
import { Brain, Home, BookOpen, Calendar, MessageSquare, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 h-16 px-4 border-b border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div className="font-semibold">Smart Learning</div>
          </div>
          <nav className="p-3 space-y-1 text-sm">
            <Link href="/dashboard/student" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
              <Home className="h-4 w-4" /> Overview
            </Link>
            <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
              <BookOpen className="h-4 w-4" /> Courses
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
              <Calendar className="h-4 w-4" /> Schedule
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
              <MessageSquare className="h-4 w-4" /> Messages
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
              <Settings className="h-4 w-4" /> Settings
            </a>
          </nav>
          <div className="mt-auto p-3 border-t border-white/10 text-xs text-white/70">
            <div className="px-3 pb-2">{email}</div>
            <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-4">
            <div className="font-semibold">Student Dashboard</div>
            <div className="text-xs text-white/70">{email}</div>
          </header>
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}


