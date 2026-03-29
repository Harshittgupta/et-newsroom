import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
};

export async function POST(req: NextRequest) {
  const { text, targetLang } = await req.json();
  const langName = LANG_NAMES[targetLang] ?? "Hindi";

  try {
    const raw = await callGroq({
      max_tokens: 1200,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are an expert financial translator and cultural adaptor for the Economic Times of India.
Your job is NOT to literally translate — you must culturally adapt business news for ${langName}-speaking readers.

Respond ONLY with valid JSON (no markdown fences, no extra text):
{
  "text": "The full culturally-adapted article in ${langName} script (3-5 sentences). Use local idioms where natural. Keep financial terms like repo rate, Sensex in English but explain them in ${langName}.",
  "context": "2-3 sentences in ${langName} explaining what this means for a common person in that region.",
  "localExample": "One concrete, relatable example with local rupee figures showing the real-world impact."
}

Write naturally as a ${langName} journalist would. Use local references. Explain jargon simply.`,
        },
        {
          role: "user",
          content: `Culturally adapt this English business news to ${langName}:\n\n${text}`,
        },
      ],
    });

    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return NextResponse.json({ result });
  } catch (err: unknown) {
    const isNoKey = err instanceof Error && err.message === "NO_KEY";
    return NextResponse.json({
      result: null,
      error: isNoKey
        ? "Add GROQ_API_KEY to .env.local (free at console.groq.com)"
        : "Translation failed",
    });
  }
}
