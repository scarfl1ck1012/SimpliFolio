import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface PortfolioData {
  expectedReturn: number;
  volatility: number;
  variance: number;
  sharpeRatio: number;
  weights: { symbol: string; weight: number }[];
  optimizedSharpe?: number;
}

function buildPrompt(data: PortfolioData): string {
  const weightsList = data.weights
    .map((w) => `${w.symbol}: ${(w.weight * 100).toFixed(1)}%`)
    .join(", ");

  return `You are a friendly financial advisor explaining portfolio analysis to a complete beginner. 
Use simple language, analogies, and emojis. Keep it under 200 words.

Here are the portfolio results:
- Assets: ${weightsList}
- Expected Annual Return: ${(data.expectedReturn * 100).toFixed(2)}%
- Volatility (Risk): ${(data.volatility * 100).toFixed(2)}%
- Sharpe Ratio: ${data.sharpeRatio.toFixed(3)}
${data.optimizedSharpe ? `- Optimized Sharpe Ratio: ${data.optimizedSharpe.toFixed(3)}` : ""}

Explain:
1. What these numbers mean in plain English
2. Whether this is a good or risky portfolio
3. One actionable tip to improve it

Use a warm, encouraging tone. Format with short paragraphs.`;
}

async function callGroq(prompt: string): Promise<string | null> {
  if (!GROQ_API_KEY) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", res.status);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("Groq call failed:", err);
    return null;
  }
}

async function callGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      },
    );

    if (!res.ok) {
      console.error("Gemini API error:", res.status);
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("Gemini call failed:", err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: PortfolioData = await request.json();
    const prompt = buildPrompt(body);

    // Try Groq first (primary)
    let explanation = await callGroq(prompt);
    let provider = "groq";

    // Fallback to Gemini
    if (!explanation) {
      explanation = await callGemini(prompt);
      provider = "gemini";
    }

    // If both fail, return null (frontend shows raw metrics)
    if (!explanation) {
      return NextResponse.json({
        explanation: null,
        provider: null,
        error: "Both AI providers unavailable",
      });
    }

    return NextResponse.json({ explanation, provider });
  } catch (error) {
    console.error("AI explain error:", error);
    return NextResponse.json(
      {
        explanation: null,
        provider: null,
        error: "Failed to generate explanation",
      },
      { status: 500 },
    );
  }
}
