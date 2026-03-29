// lib/groq.ts
// Free AI via Groq — sign up at https://console.groq.com (no credit card needed)
// Uses llama-3.3-70b: fast, capable, completely free tier

export const GROQ_MODEL = "llama-3.3-70b-versatile";
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqOptions {
  messages: GroqMessage[];
  max_tokens?: number;
  temperature?: number;
}

export async function callGroq(options: GroqOptions): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("NO_KEY");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: options.max_tokens ?? 1024,
      temperature: options.temperature ?? 0.7,
      messages: options.messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
