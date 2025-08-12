// server/services/openai.ts
import OpenAI from "openai";

const getClient = () => {
  const disabled = process.env.DISABLE_AI === "true";
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (disabled || !apiKey) return null;
  return new OpenAI({ apiKey });
};

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  const client = getClient();
  if (!client) return "AI disabled in dev. Set OPENAI_API_KEY to enable.";
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
  });
  return res.choices[0].message.content || "";
}

// NOTE: keep this exact name to match routes.ts
export async function generateProductRecommendations(userQuery: string): Promise<{
  recommendations: Array<{ title: string; reason?: string }>;
  explanation: string;
}> {
  const client = getClient();
  if (!client) {
    return {
      recommendations: [],
      explanation: "AI disabled in dev. Add OPENAI_API_KEY to enable recommendations.",
    };
  }

  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a fashion assistant. Respond in JSON." },
      { role: "user", content: userQuery },
    ],
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(res.choices[0].message.content || "{}");
  return {
    recommendations: parsed.recommendations || [],
    explanation: parsed.explanation || "Here are matching products.",
  };
}

// Stubbed for dev; add real vision logic later if needed
export async function analyzeDesignImage(_base64OrUrl: string): Promise<{
  success: boolean;
  description?: string;
  suggestions?: string[];
  error?: string;
}> {
  const client = getClient();
  if (!client) {
    return {
      success: true,
      description: "AI disabled in dev.",
      suggestions: ["Add OPENAI_API_KEY to enable image analysis."],
    };
  }
  // If you want real image analysis later, implement with GPT‑4o vision here.
  return {
    success: false,
    error: "analyzeDesignImage not implemented yet.",
  };
}