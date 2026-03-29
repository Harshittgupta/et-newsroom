import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const { article, duration = "90" } = await req.json();

  if (!article || typeof article !== "string") {
    return NextResponse.json({ script: null, error: "article text is required" }, { status: 400 });
  }

  const seconds = parseInt(duration) || 90;
  const segmentCount = seconds <= 60 ? 4 : seconds <= 90 ? 5 : 6;

  try {
    const raw = await callGroq({
      max_tokens: 2000,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `You are a broadcast journalist and video producer for ET Now (Economic Times TV channel).
Create a ${seconds}-second video script from the given article.

Respond ONLY with valid JSON — no markdown fences, no explanation:
{
  "title": "Catchy broadcast headline (max 10 words)",
  "duration": "${seconds} seconds",
  "thumbnail": "Single emoji representing the story",
  "mood": "bullish|bearish|neutral|breaking",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "keyStats": [
    {"label": "Key metric name", "value": "numeric value with unit", "trend": "up|down|neutral"},
    {"label": "Key metric name", "value": "numeric value with unit", "trend": "up|down|neutral"},
    {"label": "Key metric name", "value": "numeric value with unit", "trend": "up|down|neutral"}
  ],
  "segments": [
    ${Array.from({ length: segmentCount }, (_, i) => `{"time": "segment ${i+1}", "text": "narration text", "visual": "specific visual/animation description", "bgColor": "hex color like #0D1B2A", "accentColor": "hex color like #E8B84B", "dataOverlay": "optional stat or number to show on screen or null"}`).join(",\n    ")}
  ],
  "bottomLine": "One sentence takeaway for viewers"
}

Rules:
- keyStats must be REAL numbers extracted from the article
- Each segment narration should be punchy, 1-2 sentences
- bgColor and accentColor should match the story mood (red for bearish, green for bullish, gold for neutral)
- dataOverlay is a key number to flash on screen (e.g. "+2.3%", "₹4,200 Cr", "6.5%") or null
- Use Indian financial context (₹, crore, lakh, bps)`,
        },
        {
          role: "user",
          content: `Create a ${seconds}-second video script:\n\n${article}`,
        },
      ],
    });

    const clean = raw.replace(/```json|```/g, "").trim();
    const script = JSON.parse(clean);
    return NextResponse.json({ script });

  } catch (err: unknown) {
    const isNoKey = err instanceof Error && err.message === "NO_KEY";
    return NextResponse.json({
      script: null,
      error: isNoKey
        ? "Add GROQ_API_KEY to .env.local (free at console.groq.com)"
        : "Failed to generate script",
    });
  }
}
