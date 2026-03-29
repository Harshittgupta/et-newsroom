"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, TrendingUp, TrendingDown, ChevronRight, AlertCircle, Eye } from "lucide-react";

const STORIES = [
  { id: "rbi-policy",   label: "RBI Monetary Policy Cycle",       status: "ongoing",  count: 32 },
  { id: "budget-2025",  label: "Union Budget 2025",                status: "upcoming", count: 18 },
  { id: "adani-saga",   label: "Adani Group Controversy",          status: "ongoing",  count: 87 },
  { id: "paytm",        label: "Paytm RBI Crisis & Recovery",      status: "resolved", count: 43 },
];

const TIMELINE = [
  { date: "Oct 9, 2024",  title: "MPC holds rate; shifts to 'neutral' stance",            sentiment: "positive", category: "Decision",  impact: "high"   },
  { date: "Sep 12, 2024", title: "CPI inflation eases to 3.7% — below RBI target",       sentiment: "positive", category: "Data",      impact: "medium" },
  { date: "Aug 8, 2024",  title: "MPC holds for 7th consecutive time",                    sentiment: "neutral",  category: "Decision",  impact: "medium" },
  { date: "Jul 19, 2024", title: "RBI governor hints at monitoring global developments",  sentiment: "neutral",  category: "Statement", impact: "low"    },
  { date: "Jun 7, 2024",  title: "Food inflation spikes; rate cut hopes pushed to 2025", sentiment: "negative", category: "Analysis",  impact: "high"   },
  { date: "Apr 5, 2024",  title: "RBI surprises with unchanged stance; markets react",   sentiment: "negative", category: "Decision",  impact: "high"   },
  { date: "Feb 8, 2024",  title: "MPC holds; GDP forecast raised to 7%",                 sentiment: "positive", category: "Decision",  impact: "medium" },
];

const PLAYERS = [
  { name: "Shaktikanta Das",       role: "RBI Governor",             stance: "Hawkish → Cautiously neutral", avatar: "SD" },
  { name: "Dr. Ashima Goyal",      role: "MPC Member (External)",    stance: "Dovish — voted for immediate cut", avatar: "AG" },
  { name: "Michael Patra",         role: "Deputy Governor",          stance: "Cautiously neutral", avatar: "MP" },
  { name: "Saugata Bhattacharya",  role: "MPC Member (External)",    stance: "Neutral", avatar: "SB" },
];

const CONTRARIAN = [
  { source: "HDFC Securities", view: "Market is over-reading the stance change. No cut before Feb 2025.", signal: "bearish" },
  { source: "Nomura India",    view: "December cut is on the table if November CPI surprises to the downside.", signal: "bullish" },
  { source: "BofA Research",   view: "RBI will align with the Fed — expect February 2025 cut.", signal: "neutral" },
];

type Tab = "timeline" | "players" | "contrarian";

export default function StoryArcPage() {
  const [activeStory, setActiveStory] = useState("rbi-policy");
  const [activeTab, setActiveTab] = useState<Tab>("timeline");

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={16} className="text-jade" />
            <span className="text-pearl/40 text-xs uppercase tracking-widest">Story Arc Tracker</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-pearl">
            Visual <span className="text-jade">Narrative Intelligence</span>
          </h1>
          <p className="text-pearl/40 text-sm mt-1">Follow any ongoing story. AI builds the complete picture — timeline, players, sentiment, predictions.</p>
        </div>

        {/* Story selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STORIES.map(({ id, label, status, count }) => (
            <button key={id} onClick={() => setActiveStory(id)}
              className={`text-left p-4 rounded-xl border transition-all ${activeStory === id ? "border-jade/40 bg-jade/5" : "glass border-transparent"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`pill ${status === "ongoing" ? "bg-jade/10 text-jade" : status === "resolved" ? "bg-pearl/10 text-pearl/40" : "bg-gold/10 text-gold"}`}>
                  {status}
                </span>
                <span className="text-pearl/30 text-xs font-mono">{count}</span>
              </div>
              <p className="text-pearl/80 text-sm font-medium leading-snug">{label}</p>
            </button>
          ))}
        </div>

        {/* Sentiment overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Bullish Articles", value: "58%", icon: TrendingUp,   color: "text-jade",   bg: "bg-jade/10"   },
            { label: "Neutral Coverage", value: "27%", icon: Eye,          color: "text-azure",  bg: "bg-azure/10"  },
            { label: "Bearish/Critical", value: "15%", icon: TrendingDown, color: "text-scarlet", bg: "bg-scarlet/10" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass rounded-xl p-4 text-center">
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon size={14} className={color} />
              </div>
              <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
              <div className="text-pearl/40 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 glass rounded-xl p-1 w-fit">
          {(["timeline", "players", "contrarian"] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? "bg-jade/20 text-jade" : "text-pearl/40 hover:text-pearl/70"}`}>
              {tab === "timeline" ? "📅 Timeline" : tab === "players" ? "👥 Key Players" : "⚡ Contrarian Views"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "timeline" && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative">
                <div className="absolute left-[120px] top-0 bottom-0 w-px bg-jade/10" />
                <div className="space-y-4">
                  {TIMELINE.map((event, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }} className="flex items-start gap-6">
                      <div className="w-[105px] flex-shrink-0 text-right">
                        <span className="text-pearl/30 text-xs">{event.date}</span>
                      </div>
                      <div className="relative flex-shrink-0 mt-1">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          event.sentiment === "positive" ? "border-jade bg-jade/20" :
                          event.sentiment === "negative" ? "border-scarlet bg-scarlet/20" : "border-pearl/30 bg-pearl/10"
                        }`} />
                        {event.impact === "high" && (
                          <div className={`absolute inset-0 rounded-full animate-ping ${event.sentiment === "positive" ? "bg-jade/30" : "bg-scarlet/30"}`} />
                        )}
                      </div>
                      <div className={`flex-1 glass rounded-xl p-4 card-hover ${event.impact === "high" ? "border-l-2 border-jade/30" : ""}`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-pearl/80 text-sm font-medium leading-snug">{event.title}</p>
                          <div className="flex gap-1 flex-shrink-0">
                            <span className="pill bg-white/5 text-pearl/40">{event.category}</span>
                            {event.impact === "high" && <span className="pill bg-scarlet/10 text-scarlet">High Impact</span>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="mt-8 glass-gold rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-gold mt-0.5" />
                  <div>
                    <p className="text-gold font-semibold text-sm mb-2">What to Watch Next</p>
                    <ul className="space-y-1.5 text-pearl/60 text-sm">
                      <li className="flex items-start gap-2"><ChevronRight size={12} className="text-gold mt-0.5 flex-shrink-0" /> Nov CPI data (Dec 12) — below 4% raises December cut probability sharply</li>
                      <li className="flex items-start gap-2"><ChevronRight size={12} className="text-gold mt-0.5 flex-shrink-0" /> RBI December MPC — first meeting under neutral stance</li>
                      <li className="flex items-start gap-2"><ChevronRight size={12} className="text-gold mt-0.5 flex-shrink-0" /> US Fed December meeting — global signal for RBI direction</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "players" && (
            <motion.div key="players" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLAYERS.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} className="glass rounded-xl p-5 flex items-start gap-4 card-hover">
                  <div className="w-10 h-10 rounded-full bg-jade/20 flex items-center justify-center text-jade text-xs font-bold flex-shrink-0">
                    {p.avatar}
                  </div>
                  <div>
                    <h3 className="text-pearl font-semibold text-sm">{p.name}</h3>
                    <p className="text-pearl/40 text-xs mb-2">{p.role}</p>
                    <p className="text-jade/80 text-xs bg-jade/10 px-3 py-1.5 rounded-lg inline-block">{p.stance}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "contrarian" && (
            <motion.div key="contrarian" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-4">
              {CONTRARIAN.map((c, i) => (
                <motion.div key={c.source} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass rounded-xl p-5 border-l-2 ${c.signal === "bullish" ? "border-jade" : c.signal === "bearish" ? "border-scarlet" : "border-pearl/20"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-pearl/60 text-xs font-semibold uppercase tracking-wide mb-2">{c.source}</p>
                      <p className="text-pearl/80 text-sm leading-relaxed">{c.view}</p>
                    </div>
                    <span className={`pill flex-shrink-0 ${c.signal === "bullish" ? "bg-jade/10 text-jade" : c.signal === "bearish" ? "bg-scarlet/10 text-scarlet" : "bg-pearl/10 text-pearl/40"}`}>
                      {c.signal}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
