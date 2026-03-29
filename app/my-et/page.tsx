"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/lib/news";
import type { Database } from "@/lib/database.types";
import {
  TrendingUp, TrendingDown, Clock, Bookmark, Share2,
  ChevronRight, Filter, RefreshCw, Briefcase, BarChart2,
  GraduationCap, Loader2, ExternalLink, X, Plus
} from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type WatchlistItem = Database["public"]["Tables"]["watchlist"]["Row"];
type BookmarkItem = Database["public"]["Tables"]["bookmarks"]["Row"];

const PERSONAS = [
  { id: "investor", label: "Investor",       icon: TrendingUp, color: "#E8B84B" },
  { id: "founder",  label: "Founder",        icon: Briefcase,  color: "#00C896" },
  { id: "student",  label: "Student",        icon: GraduationCap, color: "#3B82F6" },
  { id: "analyst",  label: "Analyst",        icon: BarChart2,  color: "#E83B3B" },
];

const MOCK_PRICES: Record<string, { change: string; up: boolean }> = {
  HDFCBANK:   { change: "+2.3%", up: true  },
  RELIANCE:   { change: "-0.4%", up: false },
  INFY:       { change: "+2.1%", up: true  },
  TCS:        { change: "+1.8%", up: true  },
  BAJFINANCE: { change: "+0.9%", up: true  },
};

export default function MyETPage() {
  const supabase = createClient();

  const [profile, setProfile]     = useState<Profile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [articles, setArticles]   = useState<Article[]>([]);
  const [loading, setLoading]     = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [addStock, setAddStock]   = useState("");
  const [savingId, setSavingId]   = useState<string | null>(null);

  // Load profile + watchlist + bookmarks
  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (!res.ok) return;
    const data = await res.json();
    setProfile(data.profile);
    setWatchlist(data.watchlist ?? []);
    setBookmarks(data.bookmarks ?? []);
  }, []);

  // Load news articles
  const loadNews = useCallback(async (persona: string, category: string) => {
    setNewsLoading(true);
    try {
      const res = await fetch(`/api/news?persona=${persona}&category=${category}`);
      const data = await res.json();
      setArticles(data.articles ?? []);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadProfile().then(() => setLoading(false));
  }, [loadProfile]);

  // Reload news when persona or category changes
  useEffect(() => {
    if (profile) loadNews(profile.persona, activeCategory);
  }, [profile?.persona, activeCategory, loadNews]);

  const switchPersona = async (personaId: string) => {
    if (!profile || personaId === profile.persona) return;
    setProfile(p => p ? { ...p, persona: personaId } : p);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: personaId }),
    });
  };

  const toggleBookmark = async (article: Article) => {
    setSavingId(article.id);
    const isBookmarked = bookmarks.some(b => b.article_id === article.id);

    if (isBookmarked) {
      await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: article.id }),
      });
      setBookmarks(bs => bs.filter(b => b.article_id !== article.id));
    } else {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: article.id,
          article_title: article.title,
          article_url: article.url,
          article_category: article.category,
        }),
      });
      setBookmarks(bs => [...bs, {
        id: Date.now().toString(), user_id: profile?.id ?? "",
        article_id: article.id, article_title: article.title,
        article_url: article.url, article_category: article.category,
        created_at: new Date().toISOString(),
      }]);
    }
    setSavingId(null);
  };

  const addToWatchlist = async () => {
    const sym = addStock.toUpperCase().trim();
    if (!sym) return;
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol: sym, display_name: sym }),
    });
    setWatchlist(w => [...w, { id: Date.now().toString(), user_id: profile?.id ?? "", symbol: sym, display_name: sym, added_at: new Date().toISOString() }]);
    setAddStock("");
  };

  const removeFromWatchlist = async (symbol: string) => {
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    setWatchlist(w => w.filter(s => s.symbol !== symbol));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center">
        <Loader2 size={24} className="text-gold animate-spin" />
      </div>
    );
  }

  const currentPersona = PERSONAS.find(p => p.id === profile?.persona) ?? PERSONAS[0];
  const bookmarkedIds = new Set(bookmarks.map(b => b.article_id));

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-pearl/40 text-xs mb-1">Good morning, {profile?.full_name?.split(" ")[0] ?? "there"}</p>
            <h1 className="font-display text-3xl font-bold text-pearl">
              Your <span className="text-gradient-gold">Newsroom</span>
            </h1>
            <p className="text-pearl/40 text-sm mt-1">Curated for your {currentPersona.label.toLowerCase()} profile</p>
          </div>
          <button onClick={() => profile && loadNews(profile.persona, activeCategory)}
            className="flex items-center gap-2 glass px-4 py-2 rounded-lg text-pearl/60 hover:text-pearl text-sm transition-colors">
            <RefreshCw size={12} className={newsLoading ? "animate-spin" : ""} />
            Refresh feed
          </button>
        </div>

        {/* Persona selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {PERSONAS.map(({ id, label, icon: Icon, color }) => (
            <button key={id} onClick={() => switchPersona(id)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-left ${
                profile?.persona === id
                  ? "text-pearl" : "glass border-transparent text-pearl/50 hover:text-pearl/80"
              }`}
              style={profile?.persona === id ? { borderColor: color, background: `${color}10` } : {}}>
              <Icon size={14} style={{ color }} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* AI insight bar */}
        <div className="glass-gold rounded-xl p-4 mb-8 flex items-start gap-3">
          <div className="w-7 h-7 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gold text-xs font-bold">AI</span>
          </div>
          <p className="text-pearl/70 text-sm">
            <span className="text-gold font-semibold">Today's Signal · </span>
            Personalized insights load here based on your {currentPersona.label} profile and live market data.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* Category filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <Filter size={12} className="text-pearl/30 flex-shrink-0" />
              {[{ id: "all", label: "All", color: "#F0EDE8" }, ...CATEGORIES].map(({ id, label, color }) => (
                <button key={id} onClick={() => setActiveCategory(id)}
                  className="flex-shrink-0 pill transition-all"
                  style={activeCategory === id
                    ? { background: `${color}20`, color, border: `1px solid ${color}40` }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(240,237,232,0.4)" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Loading state */}
            {newsLoading && (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="glass rounded-xl p-5 h-36 shimmer" />
                ))}
              </div>
            )}

            {/* Articles */}
            {!newsLoading && (
              <div className="space-y-4">
                {articles.length === 0 && (
                  <div className="glass rounded-xl p-12 text-center text-pearl/30">
                    No articles found. Try a different category.
                  </div>
                )}
                {articles.map((item, i) => {
                  const cat = CATEGORIES.find(c => c.id === item.category);
                  const isBookmarked = bookmarkedIds.has(item.id);
                  return (
                    <motion.article key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass rounded-xl p-5 card-hover group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="pill" style={{ background: `${cat?.color ?? "#fff"}15`, color: cat?.color ?? "#fff" }}>
                              {cat?.label ?? item.category}
                            </span>
                            {item.impact === "high" && <span className="pill bg-scarlet/10 text-scarlet">High Impact</span>}
                            <span className="text-pearl/30 text-[10px] flex items-center gap-1">
                              <Clock size={9} /> {item.time}
                            </span>
                            <span className="text-pearl/20 text-[10px]">{item.source}</span>
                          </div>

                          <h2 className="font-display text-base sm:text-lg font-bold text-pearl mb-2 leading-snug group-hover:text-gold transition-colors">
                            {item.title}
                          </h2>
                          <p className="text-pearl/50 text-sm leading-relaxed mb-3">{item.summary}</p>

                          <div className="flex items-center gap-3">
                            <span className="text-pearl/30 text-xs flex items-center gap-1">
                              <Clock size={9} /> {item.readTime}
                            </span>
                            {item.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] text-pearl/30 bg-white/5 px-2 py-0.5 rounded">#{t}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex flex-col items-end gap-3">
                          <div className="text-center">
                            <div className="text-gold font-bold text-lg font-mono">{item.relevance}%</div>
                            <div className="text-pearl/30 text-[9px] uppercase tracking-wide">Relevant</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleBookmark(item)}
                              disabled={savingId === item.id}
                              className="w-7 h-7 flex items-center justify-center rounded-lg glass hover:bg-gold/10 transition-colors">
                              {savingId === item.id
                                ? <Loader2 size={10} className="animate-spin text-pearl/30" />
                                : <Bookmark size={11} className={isBookmarked ? "text-gold fill-gold" : "text-pearl/30"} />
                              }
                            </button>
                            {item.url !== "#" && (
                              <a href={item.url} target="_blank" rel="noopener noreferrer"
                                className="w-7 h-7 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition-colors">
                                <ExternalLink size={11} className="text-pearl/30" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-5">
            {/* Watchlist */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-pearl/60 text-xs uppercase tracking-widest mb-4">Watchlist</h3>
              {watchlist.map(stock => {
                const price = MOCK_PRICES[stock.symbol] ?? { change: "0.0%", up: true };
                return (
                  <div key={stock.symbol} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
                    <span className="text-pearl/80 text-sm">{stock.display_name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-semibold ${price.up ? "text-jade" : "text-scarlet"}`}>
                        {price.up ? <TrendingUp size={10} className="inline mr-1" /> : <TrendingDown size={10} className="inline mr-1" />}
                        {price.change}
                      </span>
                      <button onClick={() => removeFromWatchlist(stock.symbol)}
                        className="opacity-0 group-hover:opacity-100 text-pearl/20 hover:text-scarlet transition-all">
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add stock */}
              <div className="flex gap-2 mt-3">
                <input value={addStock} onChange={e => setAddStock(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addToWatchlist()}
                  placeholder="Add symbol (e.g. WIPRO)"
                  className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-xs text-pearl/70 placeholder-pearl/20 focus:outline-none focus:ring-1 focus:ring-gold/30" />
                <button onClick={addToWatchlist} className="w-7 h-7 bg-gold/20 rounded-lg flex items-center justify-center hover:bg-gold/30 transition-colors">
                  <Plus size={12} className="text-gold" />
                </button>
              </div>
            </div>

            {/* Saved bookmarks */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-pearl/60 text-xs uppercase tracking-widest mb-4">
                Saved ({bookmarks.length})
              </h3>
              {bookmarks.length === 0 && (
                <p className="text-pearl/20 text-xs">Bookmark articles to see them here.</p>
              )}
              {bookmarks.slice(0, 5).map(b => (
                <div key={b.id} className="py-2 border-b border-white/5 last:border-0">
                  <p className="text-pearl/60 text-xs leading-snug truncate">{b.article_title}</p>
                  <span className="text-pearl/20 text-[10px]">{b.article_category}</span>
                </div>
              ))}
            </div>

            {/* Trending */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-pearl/60 text-xs uppercase tracking-widest mb-4">Trending</h3>
              {["RBI Policy", "Union Budget", "Adani Group", "Startup Funding", "Nifty 25k"].map((topic, i) => (
                <div key={topic} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 cursor-pointer hover:text-gold transition-colors">
                  <span className="text-pearl/20 font-mono text-xs w-4">{i + 1}</span>
                  <span className="text-pearl/70 text-sm">{topic}</span>
                  <ChevronRight size={10} className="text-pearl/20 ml-auto" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
