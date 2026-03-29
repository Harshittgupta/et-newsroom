// lib/news.ts
// Fetches real Indian business news from NewsData.io
// Free tier: 200 requests/day, results cached 15 min to conserve quota

import { MOCK_NEWS } from "./utils";

export interface Article {
  id: string;
  title: string;
  summary: string;        // description or first 200 chars of content
  url: string;
  category: string;
  time: string;           // relative: "2 min ago"
  readTime: string;
  relevance: number;      // 0-100, computed per persona
  tags: string[];
  impact: "high" | "medium" | "low";
  source: string;
  imageUrl?: string;
}

// In-memory cache: { cacheKey → { data, fetchedAt } }
const cache = new Map<string, { data: Article[]; fetchedAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Map NewsData categories to our app categories
const CATEGORY_MAP: Record<string, string> = {
  business:  "economy",
  finance:   "markets",
  economy:   "economy",
  politics:  "policy",
  technology:"tech",
  world:     "global",
  top:       "markets",
};

function mapCategory(raw: string | null): string {
  if (!raw) return "markets";
  return CATEGORY_MAP[raw.toLowerCase()] ?? "markets";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function estimateReadTime(text: string): string {
  const words = text?.split(" ").length ?? 100;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

// Score relevance 0–100 based on persona keywords
const PERSONA_KEYWORDS: Record<string, string[]> = {
  investor: ["sensex", "nifty", "fii", "dii", "mutual fund", "sip", "equity", "dividend", "rbi", "rate", "hdfc", "reliance", "tcs", "infosys"],
  founder:  ["startup", "funding", "vc", "seed", "series", "unicorn", "valuation", "founder", "venture", "angel", "saas", "fintech"],
  student:  ["explained", "what is", "how does", "economy", "gdp", "inflation", "budget", "policy", "reform"],
  analyst:  ["earnings", "q2", "q3", "results", "margin", "revenue", "ebitda", "forecast", "analyst", "target price"],
};

function computeRelevance(article: Article, persona: string): number {
  const keywords = PERSONA_KEYWORDS[persona] ?? [];
  const text = `${article.title} ${article.summary}`.toLowerCase();
  const matches = keywords.filter(k => text.includes(k)).length;
  return Math.min(99, 50 + matches * 8);
}

function extractTags(title: string): string[] {
  // Pull capitalized words as tags (company names, proper nouns)
  const words = title.match(/\b[A-Z][a-zA-Z]{2,}\b/g) ?? [];
  return [...new Set(words)].slice(0, 4);
}

function scoreImpact(title: string, description: string): "high" | "medium" | "low" {
  const text = `${title} ${description}`.toLowerCase();
  const highSignals = ["rbi", "sensex", "nifty", "budget", "gdp", "rate cut", "rate hike", "inflation", "fed", "crash", "surge", "record"];
  const matches = highSignals.filter(s => text.includes(s)).length;
  if (matches >= 2) return "high";
  if (matches === 1) return "medium";
  return "low";
}

// ── Main fetch function ──────────────────────────────────────
export async function fetchNews(
  persona: string = "investor",
  category: string = "all"
): Promise<Article[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;

  // No API key → return rich mock data
  if (!apiKey) {
    console.warn("[fetchNews] No NEWSDATA_API_KEY found, using mock data");
    return MOCK_NEWS.map(n => ({
      ...n,
      url: "#",
      source: "Economic Times (mock)",
      relevance: computeRelevance(n as unknown as Article, persona),
    })) as unknown as Article[];
  }

  console.log(`[fetchNews] API key found: ${apiKey.substring(0, 8)}...`);

  const cacheKey = `${persona}-${category}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // Build query — simpler query for better results with free tier
    const query = encodeURIComponent("India business");
    const country = "in";
    const lang = "en";
    
    // Build category parameter only if not "all"
    let catParam = "";
    if (category !== "all") {
      // Map our internal categories to NewsData.io categories
      const categoryMap: Record<string, string> = {
        "markets": "business",
        "economy": "business", 
        "policy": "politics",
        "tech": "technology",
        "global": "world"
      };
      const apiCategory = categoryMap[category] || "business";
      catParam = `&category=${apiCategory}`;
    }

    // Use the latest endpoint - this is the correct endpoint for free tier
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${query}&country=${country}&language=${lang}${catParam}`;

    console.log(`[fetchNews] Fetching from NewsData.io for ${persona}/${category}`);
    
    const res = await fetch(url, { 
      cache: 'no-store' // Disable caching to always get fresh data
    }); 
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[fetchNews] API error ${res.status}:`, errorText);
      throw new Error(`NewsData error: ${res.status}`);
    }

    const data = await res.json();
    
    // Check for API-specific error messages
    if (data.status === "error") {
      console.error("[fetchNews] API returned error:", data.results?.message || JSON.stringify(data.results));
      throw new Error(data.results?.message || "NewsData returned error status");
    }
    
    if (data.status !== "success") {
      console.error("[fetchNews] Unexpected status:", data.status);
      throw new Error("NewsData returned non-success");
    }
    
    console.log(`[fetchNews] Successfully fetched ${data.results?.length || 0} articles`);

    const articles: Article[] = (data.results ?? [])
      .filter((item: Record<string, string>) => item.title && item.description)
      .map((item: Record<string, string>, idx: number) => {
        const article: Article = {
          id: item.article_id ?? `article-${idx}`,
          title: item.title,
          summary: item.description?.slice(0, 220) ?? "",
          url: item.link ?? "#",
          category: mapCategory(item.category?.[0]),
          time: timeAgo(item.pubDate ?? new Date().toISOString()),
          readTime: estimateReadTime(item.content ?? item.description ?? ""),
          relevance: 50,
          tags: extractTags(item.title),
          impact: scoreImpact(item.title, item.description ?? ""),
          source: item.source_id ?? "ET",
          imageUrl: item.image_url ?? undefined,
        };
        article.relevance = computeRelevance(article, persona);
        return article;
      })
      .sort((a: Article, b: Article) => b.relevance - a.relevance);

    cache.set(cacheKey, { data: articles, fetchedAt: Date.now() });
    return articles;
  } catch (err) {
    console.error("[fetchNews] failed, using mock data:", err);
    // Graceful fallback to mock data
    return MOCK_NEWS.map(n => ({
      ...n,
      url: "#",
      source: "ET (cached)",
      relevance: computeRelevance(n as unknown as Article, persona),
    })) as unknown as Article[];
  }
}
