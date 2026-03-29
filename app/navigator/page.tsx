"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Zap, Send, ChevronDown, Loader2, BookOpen,
  ExternalLink, MessageSquare, RotateCcw, Save, Check
} from "lucide-react";

const TOPICS = [
  "RBI Monetary Policy — What it means for your money",
  "Union Budget 2025 — Tax & Spending Analysis",
  "India-China Trade Relations in 2024",
  "Adani Group: A complete timeline",
  "Startup Funding Winter: Causes & Recovery",
];

const INITIAL_BRIEFING = `# RBI Monetary Policy — Full Intelligence Briefing

## The Decision
The Reserve Bank of India's Monetary Policy Committee voted 5-1 to hold the repo rate at 6.5% for the eighth consecutive time. The stance shifted from withdrawal of accommodation to neutral — a significant signal.

## Why This Matters
This is a coded message: rate cuts are being actively discussed. The lone dissenting vote came from Dr. Ashima Goyal, who wanted an immediate 25bps cut.

## Key Data Points
- Inflation forecast: Revised down to 4.5% for FY25
- GDP growth: Maintained at 7.2% for FY25
- Core inflation: Easing to 3.7% — below the RBI comfort zone
- Kharif crop output: Above normal, supporting food price stability

## What Happens Next
Markets are pricing in a 25bps cut in December 2024 or February 2025. The Fed's pivot gives RBI room to manoeuvre. Watch for the November CPI print on Dec 12.

## Impact by Asset Class
- Equity: Positive short-term, neutral long-term
- Debt/Bonds: Strong positive — bond prices rise as yields fall
- Real Estate: Positive — cheaper home loans ahead
- Gold: Neutral — already priced in

## Contrarian View
HDFC Securities argues the market is over-reading the stance change. With US election risk and crude oil volatility, RBI may stay on hold through Q1 2025.`;

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "What does the stance change mean for debt mutual funds?",
  "How does this compare to Fed rate decisions?",
  "Which sectors benefit most from a rate cut?",
  "What is the dissenting view from Dr. Ashima Goyal?",
];

export default function NavigatorPage() {
  const supabase = createClient();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, context: INITIAL_BRIEFING, topic }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.content }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Connection error. Please check your GROQ_API_KEY." }]);
    }
    setLoading(false);
    setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 100);
  };

  const saveBriefing = async () => {
    if (!userId || messages.length === 0) return;
    setSaving(true);
    await supabase.from("briefing_history").insert({
      user_id: userId,
      topic,
      messages: messages as unknown as Record<string, unknown>[],
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const clearChat = () => { setMessages([]); setSaved(false); };

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-scarlet" />
            <span className="text-pearl/40 text-xs uppercase tracking-widest">News Navigator</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-pearl">
            Intelligence <span className="text-scarlet">Briefing</span>
          </h1>
          <div className="relative inline-block w-full max-w-xl mt-4">
            <select value={topic} onChange={e => { setTopic(e.target.value); clearChat(); }}
              className="w-full glass rounded-xl px-4 py-3 text-pearl/80 text-sm appearance-none cursor-pointer focus:outline-none border border-white/10 bg-transparent pr-10">
              {TOPICS.map(t => <option key={t} value={t} className="bg-ink-900">{t}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-pearl/40 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Briefing */}
          <div className="lg:col-span-3">
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-scarlet" />
                  <span className="text-pearl/60 text-xs">AI-Synthesized from ET coverage</span>
                </div>
                <button onClick={() => setShowSources(!showSources)}
                  className="text-xs text-pearl/40 hover:text-pearl/70 flex items-center gap-1">
                  <ExternalLink size={11} /> Sources
                </button>
              </div>
              <AnimatePresence>
                {showSources && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden px-5 py-3 bg-white/2 border-b border-white/5">
                    {["RBI Policy Statement", "ET Markets Analysis", "ET Economy Desk", "Bloomberg India", "HDFC Securities Research"].map(s => (
                      <div key={s} className="text-pearl/40 text-xs py-1 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-scarlet" />{s}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="p-6 overflow-y-auto max-h-[600px]">
                <div className="space-y-3 text-pearl/80 text-sm leading-relaxed">
                  {INITIAL_BRIEFING.split("\n").map((line, i) => {
                    if (line.startsWith("# "))  return <h2 key={i} className="font-display text-xl font-black text-pearl mb-2">{line.slice(2)}</h2>;
                    if (line.startsWith("## ")) return <h3 key={i} className="font-display text-base font-bold text-pearl mt-5 mb-1 gold-line pl-3">{line.slice(3)}</h3>;
                    if (line.startsWith("- "))  return <p key={i} className="flex gap-2 ml-2"><span className="text-gold mt-1 flex-shrink-0">•</span><span>{line.slice(2)}</span></p>;
                    if (line.trim() === "")     return <br key={i} />;
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="glass rounded-xl flex flex-col min-h-[540px]">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={13} className="text-scarlet" />
                  <span className="text-pearl/60 text-xs">Ask about this briefing</span>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && userId && (
                    <button onClick={saveBriefing} disabled={saving || saved}
                      className="flex items-center gap-1 text-xs text-pearl/40 hover:text-jade transition-colors">
                      {saved ? <><Check size={11} className="text-jade" /> Saved</> :
                       saving ? <Loader2 size={11} className="animate-spin" /> :
                       <><Save size={11} /> Save</>}
                    </button>
                  )}
                  <button onClick={clearChat} className="text-pearl/20 hover:text-pearl/50">
                    <RotateCcw size={11} />
                  </button>
                </div>
              </div>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-pearl/30 text-xs mb-4">Suggested questions:</p>
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => setInput(s)}
                        className="w-full text-left text-xs text-pearl/50 hover:text-pearl/80 glass px-3 py-2.5 rounded-lg transition-all hover:glass-gold">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className={msg.role === "user" ? "text-right" : ""}>
                    <div className={`inline-block max-w-[90%] text-sm px-4 py-2.5 rounded-xl leading-relaxed text-left ${
                      msg.role === "user" ? "bg-scarlet/20 text-pearl/90 rounded-tr-sm" : "glass text-pearl/80 rounded-tl-sm"
                    }`}>{msg.content}</div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-pearl/40 text-xs">
                    <Loader2 size={12} className="animate-spin" /> Thinking...
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-white/5 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-pearl/80 placeholder-pearl/20 focus:outline-none focus:ring-1 focus:ring-scarlet/40" />
                <button onClick={sendMessage} disabled={loading || !input.trim()}
                  className="w-9 h-9 bg-scarlet rounded-lg flex items-center justify-center hover:bg-scarlet/80 transition-colors disabled:opacity-40">
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
