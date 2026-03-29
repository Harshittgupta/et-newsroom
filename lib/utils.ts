import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MOCK_PROFILE = {
  name: "Arjun Sharma",
  persona: "Mutual Fund Investor",
  interests: ["Equity Markets", "SIP", "Large Cap", "Gold ETF", "Macroeconomics"],
  watchlist: ["HDFC Bank", "Reliance", "Infosys", "TCS", "Bajaj Finance"],
};

export const CATEGORIES = [
  { id: "markets", label: "Markets", color: "#E8B84B" },
  { id: "economy", label: "Economy", color: "#3B82F6" },
  { id: "startups", label: "Startups", color: "#00C896" },
  { id: "policy", label: "Policy", color: "#E83B3B" },
  { id: "global", label: "Global", color: "#A855F7" },
  { id: "tech", label: "Tech", color: "#06B6D4" },
];

export const MOCK_NEWS = [
  {
    id: "1",
    title: "Sensex surges 800 points as FII inflows return; Nifty eyes 24,500",
    category: "markets",
    time: "2 min ago",
    readTime: "3 min read",
    relevance: 98,
    summary: "Foreign institutional investors pumped ₹4,200 crore into Indian equities on Wednesday, pushing benchmark indices to a three-week high.",
    tags: ["Sensex", "FII", "Nifty"],
    impact: "high",
  },
  {
    id: "2",
    title: "RBI holds repo rate at 6.5%; signals pivot in Q1 2025",
    category: "policy",
    time: "1 hr ago",
    readTime: "5 min read",
    relevance: 95,
    summary: "The Monetary Policy Committee voted 5-1 to maintain the benchmark rate, while changing its stance to 'neutral' — a signal that rate cuts may come sooner than expected.",
    tags: ["RBI", "Repo Rate", "Monetary Policy"],
    impact: "high",
  },
  {
    id: "3",
    title: "Zepto turns unicorn again: $350M raised at $5B valuation",
    category: "startups",
    time: "3 hr ago",
    readTime: "4 min read",
    relevance: 72,
    summary: "Quick-commerce startup Zepto closed its latest funding round, cementing its position as one of India's fastest-growing consumer internet companies.",
    tags: ["Zepto", "Startup", "Funding"],
    impact: "medium",
  },
  {
    id: "4",
    title: "India's GDP growth forecast revised to 7.2% for FY25: IMF",
    category: "economy",
    time: "5 hr ago",
    readTime: "4 min read",
    relevance: 88,
    summary: "The International Monetary Fund raised its India growth forecast, citing strong domestic consumption and resilient services exports.",
    tags: ["GDP", "IMF", "Growth"],
    impact: "high",
  },
  {
    id: "5",
    title: "HDFC Bank Q2 results: Net profit up 18% to ₹17,800 crore",
    category: "markets",
    time: "6 hr ago",
    readTime: "3 min read",
    relevance: 96,
    summary: "India's largest private sector bank beat analyst estimates on both net interest income and asset quality metrics.",
    tags: ["HDFC Bank", "Q2 Results", "Banking"],
    impact: "high",
  },
  {
    id: "6",
    title: "Gold hits all-time high of ₹80,000 per 10g amid global uncertainty",
    category: "markets",
    time: "8 hr ago",
    readTime: "3 min read",
    relevance: 92,
    summary: "Safe-haven demand and a weaker dollar pushed gold to record levels, benefiting Gold ETF investors significantly.",
    tags: ["Gold", "ETF", "Commodity"],
    impact: "medium",
  },
];

export const STORY_ARCS = [
  { id: "budget-2025", label: "Union Budget 2025", status: "ongoing", events: 24 },
  { id: "adani-saga", label: "Adani Group Saga", status: "ongoing", events: 87 },
  { id: "paytm-crisis", label: "Paytm RBI Crisis", status: "resolved", events: 43 },
  { id: "jio-ipo", label: "Jio Financial IPO", status: "upcoming", events: 12 },
];
