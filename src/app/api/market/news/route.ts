import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY!;

export async function GET() {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`,
    );

    if (!res.ok) {
      throw new Error(`Finnhub news API returned ${res.status}`);
    }

    const data = await res.json();

    // Return top 10 articles, mapped to clean format
    const articles = data
      .slice(0, 10)
      .map(
        (item: {
          id: number;
          headline: string;
          source: string;
          url: string;
          image: string;
          datetime: number;
          summary: string;
          category: string;
        }) => ({
          id: item.id,
          headline: item.headline,
          source: item.source,
          url: item.url,
          image: item.image,
          datetime: item.datetime,
          summary: item.summary?.slice(0, 150) || "",
          category: item.category,
        }),
      );

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Market news error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }
}
