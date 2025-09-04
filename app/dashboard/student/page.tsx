"use client";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../../../src/lib/supabase";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Calendar, Bot, Trophy, Clock } from "lucide-react";

type Recommendation = { title: string; subtitle: string; progress?: number };
type Session = { title: string; with: string; time: string };

export default function StudentDashboard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lang, setLang] = useState<'en' | 'sw'>("en");
  const [track, setTrack] = useState<'CBC' | '8-4-4'>("CBC");
  const [level, setLevel] = useState<string>("Grade 7");

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/auth";
    });
    // Sessions mock
    setSessions([
      { title: "Math Tutoring", with: "Dr. Sarah Chen", time: "Today, 4:00 PM" },
      { title: "Physics Review", with: "Prof. James Wilson", time: "Tomorrow, 10:00 AM" },
    ]);
  }, []);

  const subjectsByTrack = useMemo(() => ({
    CBC: ["Mathematics", "English", "Kiswahili", "Integrated Science", "Social Studies", "Religious Education", "Pre-Technical"],
    "8-4-4": ["Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics", "Geography", "History", "CRE", "Business Studies"]
  }), []);

  const levelsCBC = ["Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"];
  const levels844 = ["Form 1","Form 2","Form 3","Form 4"];

  useEffect(() => {
    // Localized recommendations based on selection
    const recs: Recommendation[] = track === 'CBC'
      ? [
          { title: lang==='sw'?"Hesabu: Msururu wa Nambari":"Math: Number Patterns", subtitle: lang==='sw'?"Mazoezi ya mlolongo wa nambari":"Practice arithmetic sequences", progress: 55 },
          { title: lang==='sw'?"Kiswahili: Ufahamu":"Kiswahili: Comprehension", subtitle: lang==='sw'?"Soma na ujibu maswali":"Read and answer questions" },
          { title: lang==='sw'?"Sayansi Shirikishi: Nishati":"Integrated Science: Energy", subtitle: lang==='sw'?"Tofautisha nishati kinestetiki na potensheli":"Differentiate kinetic vs potential energy" }
        ]
      : [
          { title: lang==='sw'?"Hisabati: Aljebra":"Mathematics: Algebra", subtitle: lang==='sw'?"Kagua milinganyo ya kwadrati":"Revise quadratic equations", progress: 62 },
          { title: lang==='sw'?"Kemia: Asidi na Msingi":"Chemistry: Acids & Bases", subtitle: lang==='sw'?"Mazoezi ya vihisishi":"Practice indicators" },
          { title: lang==='sw'?"Kiingereza: Insha":"English: Essay Writing", subtitle: lang==='sw'?"Mpangilio wa insha na hoja":"Outline and thesis practice" }
        ];
    setRecommendations(recs);
  }, [track, level, lang]);

  return (
    <div className="space-y-4">
      {/* KE controls */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white/10 border border-white/10 rounded-2xl p-3">
          <div className="text-xs text-white/70 mb-1">Curriculum Track</div>
          <div className="flex gap-2">
            <button onClick={()=>{setTrack('CBC'); setLevel('Grade 7');}} className={`px-3 py-1.5 rounded-lg text-sm ${track==='CBC'?'bg-white/20':'bg-white/5 hover:bg-white/10'}`}>CBC (Competency Based)</button>
            <button onClick={()=>{setTrack('8-4-4'); setLevel('Form 1');}} className={`px-3 py-1.5 rounded-lg text-sm ${track==='8-4-4'?'bg-white/20':'bg-white/5 hover:bg-white/10'}`}>8-4-4 (KCSE)</button>
          </div>
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl p-3">
          <div className="text-xs text-white/70 mb-1">Level</div>
          <select value={level} onChange={(e)=>setLevel(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {(track==='CBC'?levelsCBC:levels844).map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl p-3">
          <div className="text-xs text-white/70 mb-1">Language</div>
          <div className="flex gap-2">
            <button onClick={()=>setLang('en')} className={`px-3 py-1.5 rounded-lg text-sm ${lang==='en'?'bg-white/20':'bg-white/5 hover:bg-white/10'}`}>English</button>
            <button onClick={()=>setLang('sw')} className={`px-3 py-1.5 rounded-lg text-sm ${lang==='sw'?'bg-white/20':'bg-white/5 hover:bg-white/10'}`}>Kiswahili</button>
          </div>
        </div>
      </section>
      {/* AI Assistant */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/10 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="font-semibold">AI Study Assistant</div>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/10 p-3 min-h-[120px] text-gray-200" contentEditable suppressContentEditableWarning>
            Ask anything... (press Enter to send)
          </div>
          <div className="text-xs text-white/60 mt-2">Examples: “Explain photosynthesis with a diagram”, “Generate 5 calculus practice questions”.</div>
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div className="font-semibold">Weekly Progress</div>
          </div>
          <div className="space-y-3">
            {["Math", "Physics", "Writing"].map((s, i) => (
              <div key={s} className="text-sm">
                <div className="flex justify-between mb-1"><span>{s}</span><span>{[72,58,80][i]}%</span></div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600" style={{ width: `${[72,58,80][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations + Sessions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="font-semibold">Smart Recommendations</div>
          </div>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/10">
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-white/70">{r.subtitle}</div>
                {r.progress != null && (
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600" style={{ width: `${r.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white/10 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div className="font-semibold">Upcoming Sessions</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sessions.map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/10">
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-white/70">{s.with}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-white/80">
                  <Clock className="h-3 w-3" /> {s.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { Icon: BookOpen, label: 'Start Lesson' },
          { Icon: Sparkles, label: 'Practice Quiz' },
          { Icon: Calendar, label: 'Schedule Tutor' },
          { Icon: Bot, label: 'Ask AI' }
        ].map((a, i) => (
          <button key={i} className="p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-2">
              <a.Icon className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-medium">{a.label}</div>
          </button>
        ))}
      </section>
    </div>
  );
}


