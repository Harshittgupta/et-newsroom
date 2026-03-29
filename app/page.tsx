"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { TrendingUp, Zap, Video, GitBranch, Globe2, ArrowRight, ChevronRight } from "lucide-react";

const features = [
  {
    href: "/my-et",
    icon: TrendingUp,
    title: "My ET",
    subtitle: "Personalized Newsroom",
    desc: "AI curates news for your exact profile — mutual fund investor, startup founder, student. Every story, relevance-ranked for you.",
    color: "#E8B84B",
    bg: "from-gold/10 to-transparent",
    delay: 0,
  },
  {
    href: "/navigator",
    icon: Zap,
    title: "News Navigator",
    subtitle: "Interactive Intelligence Briefings",
    desc: "One AI-powered deep briefing synthesizes 8 articles into an explorable document. Ask follow-ups. Go deeper. No tab-switching.",
    color: "#E83B3B",
    bg: "from-scarlet/10 to-transparent",
    delay: 0.08,
  },
  {
    href: "/video-studio",
    icon: Video,
    title: "AI Video Studio",
    subtitle: "News → Broadcast in 60 seconds",
    desc: "Paste any ET article. Get a broadcast-quality 90-second video with narration script, animated data visuals, and contextual overlays.",
    color: "#3B82F6",
    bg: "from-azure/10 to-transparent",
    delay: 0.16,
  },
  {
    href: "/story-arc",
    icon: GitBranch,
    title: "Story Arc Tracker",
    subtitle: "Visual Narrative Intelligence",
    desc: "Pick any ongoing story. AI builds interactive timeline, maps key players, tracks sentiment shifts, surfaces contrarian views.",
    color: "#00C896",
    bg: "from-jade/10 to-transparent",
    delay: 0.24,
  },
  {
    href: "/vernacular",
    icon: Globe2,
    title: "Vernacular Engine",
    subtitle: "Business News in Your Language",
    desc: "Real-time culturally-adapted translation into Hindi, Tamil, Telugu, Bengali. Not literal — contextually intelligent.",
    color: "#A855F7",
    bg: "from-purple-500/10 to-transparent",
    delay: 0.32,
  },
];

const ticker = [
  "SENSEX ▲ 800.24 (+1.07%)", "NIFTY 50 ▲ 243.80 (+1.03%)", "USD/INR 83.42 ▼", "GOLD ₹80,240 ▲",
  "HDFC BANK ▲ 2.3%", "RELIANCE ▼ 0.4%", "TCS ▲ 1.8%", "INFOSYS ▲ 2.1%",
  "WTI CRUDE $78.40 ▲", "10Y G-SEC 6.97% ▼", "BITCOIN ₹58.2L ▲",
];

export default function HomePage() {
  return (
    <div className="min-h-screen pt-14 relative overflow-hidden">
      <AnimatedGradientBackground
        gradientColors={["#05050A", "#0D0820", "#05050A", "#0A1505", "#05050A"]}
        gradientStops={[25, 45, 60, 80, 100]}
        Breathing
        breathingRange={8}
        animationSpeed={0.015}
      />

      {/* Ticker */}
      <div className="relative z-10 border-b border-gold/10 bg-ink-900/60 h-8 flex items-center overflow-hidden">
        <div className="flex-shrink-0 px-4 py-1 bg-gold text-ink-950 text-[10px] font-bold tracking-widest uppercase mr-4">
          LIVE
        </div>
        <div className="ticker-wrap flex-1">
          <div className="inline-flex gap-8 animate-ticker">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i} className="text-[11px] font-mono text-pearl/60 whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 glass-gold px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-medium tracking-wide">Powered by Claude AI</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black mb-6 leading-none tracking-tight">
            <span className="text-pearl">Not just news.</span>
            <br />
            <span className="text-gradient-gold">Intelligence.</span>
          </h1>

          <p className="text-pearl/50 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
            The Economic Times reimagined. AI-personalized for your world — your portfolio, your language, your depth.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/my-et" className="inline-flex items-center gap-2 bg-gold text-ink-950 px-6 py-3 rounded font-semibold text-sm hover:bg-gold-light transition-colors">
              Start My Feed <ArrowRight size={14} />
            </Link>
            <Link href="/navigator" className="inline-flex items-center gap-2 glass px-6 py-3 rounded font-medium text-sm text-pearl/70 hover:text-pearl transition-colors">
              Try News Navigator <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ href, icon: Icon, title, subtitle, desc, color, bg, delay }) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.5 }}
              className={`${features.indexOf({ href, icon: Icon, title, subtitle, desc, color, bg, delay } as typeof features[0]) === 0 ? "lg:col-span-2" : ""}`}
            >
              <Link href={href} className="block h-full glass rounded-xl p-6 card-hover group">
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${bg} mb-4`}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="pill mb-3" style={{ background: `${color}15`, color }}>
                  {subtitle}
                </div>
                <h3 className="font-display text-xl font-bold text-pearl mb-2">{title}</h3>
                <p className="text-pearl/50 text-sm leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all" style={{ color }}>
                  Explore <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
