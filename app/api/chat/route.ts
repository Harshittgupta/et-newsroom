import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const { messages, context, topic } = await req.json();

  try {
    const content = await callGroq({
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content: `You are an expert financial journalist and analyst for the Economic Times of India.
You have deep knowledge of Indian markets, economy, policy, and business.

You are answering questions about this intelligence briefing on: "${topic}"

BRIEFING CONTEXT:
${context}

Answer questions concisely (2-4 sentences). Be specific, data-driven, and insightful.
Use Indian context. Format numbers in Indian style (crore, lakh).`,
        },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    return NextResponse.json({ content });
  } catch (err: unknown) {
    const isNoKey = err instanceof Error && err.message === "NO_KEY";
    return NextResponse.json({
      content: isNoKey
        ? "⚠️ Add your free Groq API key to .env.local as GROQ_API_KEY. Get one free at console.groq.com — no credit card needed."
        : "Error connecting to AI. Please check your GROQ_API_KEY in .env.local.",
    });
  }
}
