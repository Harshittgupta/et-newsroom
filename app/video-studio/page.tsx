"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Loader2, Play, Pause, Copy, Check, Wand2,
  Clock, ChevronRight, Download, RotateCcw, TrendingUp,
  TrendingDown, Minus, Zap, RefreshCw, Newspaper,
} from "lucide-react";

interface KeyStat  { label: string; value: string; trend: "up" | "down" | "neutral"; }
interface Segment  { time: string; text: string; visual: string; bgColor: string; accentColor: string; dataOverlay: string | null; }
interface VideoScript {
  title: string; duration: string; thumbnail: string;
  mood: string; tags: string[]; keyStats: KeyStat[];
  segments: Segment[]; bottomLine: string;
}
interface NewsArticle { id: string; title: string; summary: string; url: string; source: string; }

const MOCK_SCRIPT: VideoScript = {
  title: "Markets Surge: FIIs Return, Sensex Jumps 800 Points",
  duration: "90 seconds", thumbnail: "📈", mood: "bullish",
  tags: ["Markets", "FII", "Sensex", "Nifty"],
  keyStats: [
    { label: "Sensex Gain", value: "+800 pts", trend: "up" },
    { label: "FII Inflow",  value: "₹4,200 Cr", trend: "up" },
    { label: "USD/INR",     value: "83.42",      trend: "down" },
  ],
  segments: [
    { time: "0–15s",  text: "India's markets roared back Wednesday. Sensex surged 800 points to 80,845 — a three-week high.",           bgColor: "#0A1A0A", accentColor: "#00C896", dataOverlay: "+800 pts" },
    { time: "15–35s", text: "FIIs poured ₹4,200 crore in a single session — their biggest single-day inflow in a month.",               bgColor: "#0A1205", accentColor: "#00C896", dataOverlay: "₹4,200 Cr" },
    { time: "35–55s", text: "Banking led. HDFC Bank +2.3%, ICICI +1.9%, Kotak +1.5%. Infosys and TCS also gained over 2%.",             bgColor: "#081020", accentColor: "#3B82F6", dataOverlay: "+2.3%" },
    { time: "55–75s", text: "Why are FIIs back? Fed's dovish signals mean a weaker dollar — making India and EMs more attractive.",      bgColor: "#100810", accentColor: "#A855F7", dataOverlay: null },
    { time: "75–90s", text: "Watch Nifty 24,800. If this level holds through the week, bulls stay in control.",                         bgColor: "#0A1A0A", accentColor: "#E8B84B", dataOverlay: "24,800" },
  ],
  bottomLine: "FII money is back — and markets are loving it.",
};

const SAMPLE_ARTICLE = `Sensex surges 800 points as FII inflows return; Nifty eyes 24,500

Foreign institutional investors pumped ₹4,200 crore into Indian equities on Wednesday, pushing benchmark indices to a three-week high. The BSE Sensex closed at 80,845, up 800 points (1.0%), while the Nifty 50 settled at 24,460, up 243 points.

Banking and financial services led the rally, with HDFC Bank rising 2.3%, ICICI Bank up 1.9%, and Kotak Mahindra Bank gaining 1.5%. IT stocks also participated, with Infosys and TCS up 2.1% and 1.8% respectively.

Analysts attribute the rally to improved global risk sentiment following the Fed's dovish pivot signals and easing oil prices. FIIs are returning to EMs as the dollar weakens.

The rupee strengthened 15 paise to 83.42 against the dollar. Technical analysts see Nifty targeting 24,800 in the near term.`;

// ── Animated Video Player Component ──────────────────────────
function VideoPlayer({ script }: { script: VideoScript }) {
  const [playing,     setPlaying]     = useState(false);
  const [currentSeg,  setCurrentSeg]  = useState(0);
  const [progress,    setProgress]    = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = parseInt(script.duration) || 90;
  const segDuration   = (totalDuration / script.segments.length) * 1000;

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setCurrentSeg(0);
    setProgress(0);
    setShowOverlay(false);
  }, [stop]);

  useEffect(() => {
    if (!playing) return;
    const tick = 100;
    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed += tick;
      const pct = Math.min(100, (elapsed / (totalDuration * 1000)) * 100);
      setProgress(pct);
      const segIdx = Math.min(script.segments.length - 1, Math.floor(elapsed / segDuration));
      setCurrentSeg(segIdx);
      const segElapsed = elapsed % segDuration;
      setShowOverlay(segElapsed < 1500 && !!script.segments[segIdx]?.dataOverlay);
      if (elapsed >= totalDuration * 1000) { stop(); setProgress(100); }
    }, tick);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, totalDuration, segDuration, script.segments, stop]);

  // reset when script changes
  useEffect(() => { reset(); }, [script, reset]);

  const seg = script.segments[currentSeg];
  const moodColor = script.mood === "bullish" ? "#00C896" : script.mood === "bearish" ? "#E83B3B" : "#E8B84B";

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Screen */}
      <div className="relative overflow-hidden" style={{ background: seg?.bgColor ?? "#0A0A14", height: "320px", transition: "background 0.8s ease" }}>

        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(${seg?.accentColor ?? "#E8B84B"}33 1px, transparent 1px), linear-gradient(90deg, ${seg?.accentColor ?? "#E8B84B"}33 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />

        {/* Radial glow */}
        <motion.div
          key={`glow-${currentSeg}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.22, scale: 1.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 35%, ${seg?.accentColor ?? "#E8B84B"} 0%, transparent 60%)` }}
        />

        {/* ET Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-2.5 z-10"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-black"
              style={{ background: moodColor, color: "#05050A" }}>ET</div>
            <span className="text-white/50 text-[10px] font-mono tracking-widest uppercase">NOW</span>
          </div>
          <div className="flex items-center gap-4">
            {script.keyStats.slice(0, 2).map((stat, i) => (
              <span key={i} className="text-[10px] font-mono flex items-center gap-1">
                <span className="text-white/30">{stat.label}</span>
                <span style={{ color: stat.trend === "up" ? "#00C896" : stat.trend === "down" ? "#E83B3B" : "#E8B84B" }}>
                  {stat.trend === "up" ? "▲" : stat.trend === "down" ? "▼" : "–"} {stat.value}
                </span>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: moodColor }} />
              <span className="text-white/30 text-[10px] font-mono">LIVE</span>
            </div>
          </div>
        </div>

        {/* Central content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 z-10 pt-10">
          <AnimatePresence mode="wait">
            <motion.div key={currentSeg} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }} className="text-center">
              <div className="mb-4 px-3 py-1 rounded-full text-[10px] font-mono inline-block"
                style={{ background: `${seg?.accentColor}22`, border: `1px solid ${seg?.accentColor}44`, color: seg?.accentColor }}>
                {seg?.visual}
              </div>
              <p className="text-white text-xl font-display font-bold leading-snug max-w-md mx-auto"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.9)" }}>
                {seg?.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Data overlay */}
        <AnimatePresence>
          {showOverlay && seg?.dataOverlay && (
            <motion.div initial={{ opacity: 0, scale: 0.6, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="absolute bottom-14 right-6 z-20 text-right">
              <div className="text-5xl font-black font-mono leading-none"
                style={{ color: seg.accentColor, filter: `drop-shadow(0 0 20px ${seg.accentColor}88)` }}>
                {seg.dataOverlay}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-3 z-10"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)" }}>
          <p className="text-white font-display font-semibold text-sm truncate">{script.title}</p>
        </div>

        {/* Play button when stopped */}
        {!playing && progress < 99 && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
            <button onClick={() => setPlaying(true)}
              className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              style={{ background: moodColor }}>
              <Play size={26} className="text-black ml-1" />
            </button>
          </div>
        )}
        {!playing && progress >= 99 && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
            <button onClick={reset}
              className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform glass border border-white/20">
              <RotateCcw size={20} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div className="h-full transition-all" style={{ width: `${progress}%`, background: moodColor }} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-5 py-3" style={{ background: "rgba(0,0,0,0.7)" }}>
        <div className="flex items-center gap-2">
          <button onClick={() => playing ? stop() : setPlaying(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition-all"
            style={{ background: moodColor }}>
            {playing ? <Pause size={13} className="text-black" /> : <Play size={13} className="text-black ml-0.5" />}
          </button>
          <button onClick={reset} className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white glass transition-colors">
            <RotateCcw size={11} />
          </button>
          <span className="text-white/25 text-[10px] font-mono ml-1">{script.duration}</span>
        </div>

        {/* Segment dots */}
        <div className="flex items-center gap-1.5">
          {script.segments.map((_, i) => (
            <button key={i} onClick={() => { stop(); setCurrentSeg(i); setProgress((i / script.segments.length) * 100); }}
              className="rounded-full transition-all" style={{
                width: currentSeg === i ? "18px" : "6px",
                height: "6px",
                background: currentSeg === i ? moodColor : "rgba(255,255,255,0.2)",
              }} />
          ))}
        </div>

        <div className="flex gap-1">
          {script.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
              style={{ background: `${moodColor}20`, color: moodColor }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="px-5 py-2.5 flex items-center gap-2 border-t border-white/5" style={{ background: `${moodColor}08` }}>
        <Zap size={11} style={{ color: moodColor }} />
        <span className="text-white/50 text-xs italic">{script.bottomLine}</span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function VideoStudioPage() {
  const [article,       setArticle]       = useState(SAMPLE_ARTICLE);
  const [script,        setScript]        = useState<VideoScript | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [copied,        setCopied]        = useState(false);
  const [duration,      setDuration]      = useState<"60" | "90" | "120">("90");
  const [errorMsg,      setErrorMsg]      = useState<string | null>(null);
  const [liveArticles,  setLiveArticles]  = useState<NewsArticle[]>([]);
  const [loadingNews,   setLoadingNews]   = useState(false);
  const [showPicker,    setShowPicker]    = useState(false);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const fetchLiveArticles = async () => {
    setLoadingNews(true);
    setShowPicker(true);
    try {
      const res  = await fetch("/api/news?persona=investor&category=all");
      const data = await res.json();
      setLiveArticles((data.articles ?? []).slice(0, 8));
    } catch {
      setLiveArticles([]);
    }
    setLoadingNews(false);
  };

  const generateVideo = async () => {
    if (!article.trim()) return;
    setLoading(true);
    setScript(null);
    setErrorMsg(null);
    try {
      const res  = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article, duration }),
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
      } else {
        setErrorMsg(data.error ?? "Using sample script.");
        setScript(MOCK_SCRIPT);
      }
    } catch {
      setErrorMsg("Network error. Showing sample script.");
      setScript(MOCK_SCRIPT);
    }
    setLoading(false);
  };

  const copyScript = () => {
    if (!script) return;
    const text = [
      `TITLE: ${script.title}`, `DURATION: ${script.duration}`,
      `TAGS: ${script.tags.join(", ")}`,
      `\nKEY STATS:\n${script.keyStats.map(s => `  ${s.label}: ${s.value} (${s.trend})`).join("\n")}`,
      `\nSCRIPT:`,
      ...script.segments.map(s => `\n[${s.time}]\nNARRATION: ${s.text}\nVISUAL: ${s.visual}\nDATA: ${s.dataOverlay ?? "none"}`),
      `\nBOTTOM LINE: ${script.bottomLine}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    if (!script) return;
    const text = [`ET VIDEO STUDIO SCRIPT`, `${"=".repeat(50)}`, ``, `TITLE: ${script.title}`, `DURATION: ${script.duration}`, ``, `KEY STATS:`, ...script.keyStats.map(s => `  ${s.label}: ${s.value}`), ``, `SCRIPT:`, ``, ...script.segments.map(s => `[${s.time}]\n${s.text}\nVISUAL: ${s.visual}\n`), `BOTTOM LINE: ${script.bottomLine}`].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "et-video-script.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Video size={16} className="text-azure" />
            <span className="text-pearl/40 text-xs uppercase tracking-widest">AI Video Studio</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-pearl">
            Article → <span className="text-azure">Broadcast Video</span>
          </h1>
          <p className="text-pearl/40 text-sm mt-1">
            Pick a live story or paste any article — get a real animated broadcast in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Input */}
          <div className="space-y-3">

            {/* Live news picker */}
            <div className="glass rounded-xl overflow-hidden">
              <button onClick={fetchLiveArticles}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Newspaper size={13} className="text-azure" />
                  <span className="text-pearl/70 text-sm font-medium">Pick a live news story</span>
                  <span className="pill bg-azure/10 text-azure">REAL-TIME</span>
                </div>
                {loadingNews ? <Loader2 size={13} className="text-pearl/30 animate-spin" /> : <RefreshCw size={13} className="text-pearl/30" />}
              </button>

              <AnimatePresence>
                {showPicker && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5">
                    {loadingNews && (
                      <div className="px-4 py-4 flex items-center gap-2 text-pearl/30 text-xs">
                        <Loader2 size={11} className="animate-spin" /> Fetching live stories...
                      </div>
                    )}
                    {!loadingNews && liveArticles.length === 0 && (
                      <div className="px-4 py-3">
                        <p className="text-pearl/30 text-xs">Add NEWSDATA_API_KEY to .env.local for live articles.</p>
                      </div>
                    )}
                    {!loadingNews && liveArticles.map(a => (
                      <button key={a.id}
                        onClick={() => { setArticle(`${a.title}\n\n${a.summary}`); setShowPicker(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                        <p className="text-pearl/80 text-xs leading-snug line-clamp-2">{a.title}</p>
                        <p className="text-pearl/30 text-[10px] mt-0.5">{a.source}</p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Article textarea */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-scarlet" />
                <div className="w-2 h-2 rounded-full bg-gold" />
                <div className="w-2 h-2 rounded-full bg-jade" />
                <span className="text-pearl/30 text-xs ml-2">Article text</span>
                {article && <span className="ml-auto text-pearl/20 text-[10px] font-mono">{article.length} chars</span>}
              </div>
              <textarea value={article} onChange={e => setArticle(e.target.value)} rows={13}
                className="w-full bg-transparent p-5 text-pearl/70 text-sm leading-relaxed focus:outline-none resize-none"
                placeholder="Paste any ET article, or pick a live story above..." />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-3 gap-2">
              {(["60", "90", "120"] as const).map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${duration === d ? "glass-gold text-gold" : "glass text-pearl/40 hover:text-pearl/70"}`}>
                  <Clock size={11} /> {d}s
                </button>
              ))}
            </div>

            <button onClick={generateVideo} disabled={loading || !article.trim()}
              className="w-full flex items-center justify-center gap-2 bg-azure text-white py-3.5 rounded-xl font-semibold hover:bg-azure/80 transition-colors disabled:opacity-40">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Generating broadcast...</> : <><Wand2 size={14} /> Generate {duration}s Video</>}
            </button>

            {errorMsg && <p className="text-gold/60 text-xs text-center">{errorMsg}</p>}
          </div>

          {/* Right: Output */}
          <div>
            <AnimatePresence mode="wait">

              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-10 flex flex-col items-center justify-center min-h-[500px] gap-5">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full bg-azure/10 ping-slow" />
                    <div className="w-16 h-16 rounded-full bg-azure/20 flex items-center justify-center">
                      <Video size={24} className="text-azure animate-pulse" />
                    </div>
                  </div>
                  <p className="text-pearl/50 text-sm">Building your broadcast...</p>
                  <div className="flex gap-2">{["Parsing", "Scripting", "Rendering"].map(s => (
                    <span key={s} className="text-xs text-pearl/30 bg-white/5 px-2 py-1 rounded">{s}</span>
                  ))}</div>
                </motion.div>
              )}

              {!loading && !script && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-10 flex flex-col items-center justify-center min-h-[500px] gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-azure/10 flex items-center justify-center">
                    <Video size={28} className="text-azure/30" />
                  </div>
                  <p className="text-pearl/30 text-sm">Your animated video will appear here</p>
                  <p className="text-pearl/15 text-xs">Paste an article and click Generate</p>
                </motion.div>
              )}

              {script && !loading && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-4">

                  {/* THE ANIMATED VIDEO PLAYER */}
                  <VideoPlayer script={script} />

                  {/* Key stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {script.keyStats.map((stat, i) => (
                      <div key={i} className="glass rounded-xl p-3 text-center">
                        <div className={`text-sm font-bold font-mono flex items-center justify-center gap-1 ${stat.trend === "up" ? "text-jade" : stat.trend === "down" ? "text-scarlet" : "text-gold"}`}>
                          {stat.trend === "up" ? <TrendingUp size={11} /> : stat.trend === "down" ? <TrendingDown size={11} /> : <Minus size={11} />}
                          {stat.value}
                        </div>
                        <div className="text-pearl/40 text-[10px] mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Script breakdown */}
                  <div className="glass rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-white/5">
                      <span className="text-pearl/40 text-xs uppercase tracking-wide">Script Breakdown</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {script.segments.map((seg, i) => (
                        <div key={i} onClick={() => setActiveSegment(activeSegment === i ? null : i)}
                          className="px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] text-azure bg-azure/10 px-2 py-0.5 rounded">{seg.time}</span>
                            {seg.dataOverlay && <span className="font-mono text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded">{seg.dataOverlay}</span>}
                            <ChevronRight size={10} className={`text-pearl/20 ml-auto transition-transform ${activeSegment === i ? "rotate-90" : ""}`} />
                          </div>
                          <p className="text-pearl/70 text-xs leading-relaxed">{seg.text}</p>
                          <AnimatePresence>
                            {activeSegment === i && (
                              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="text-gold/60 text-[10px] mt-2 pt-2 border-t border-white/5 overflow-hidden">
                                🎬 {seg.visual}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={copyScript} className="flex-1 flex items-center justify-center gap-2 glass py-2.5 rounded-lg text-xs text-pearl/60 hover:text-pearl transition-colors">
                      {copied ? <><Check size={12} className="text-jade" /> Copied!</> : <><Copy size={12} /> Copy Script</>}
                    </button>
                    <button onClick={downloadScript} className="flex-1 flex items-center justify-center gap-2 glass py-2.5 rounded-lg text-xs text-azure hover:bg-azure/10 transition-colors">
                      <Download size={12} /> Download
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
