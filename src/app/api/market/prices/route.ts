import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY!;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Server-side Supabase client (not browser)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];

interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get("symbols");
    const symbols = symbolsParam
      ? symbolsParam.split(",").map((s) => s.trim().toUpperCase())
      : DEFAULT_SYMBOLS;

    const results: QuoteData[] = [];
    const symbolsToFetch: string[] = [];

    // 1. Check Supabase cache first
    const { data: cached } = await supabase
      .from("market_cache")
      .select("*")
      .in("symbol", symbols);

    const now = Date.now();

    for (const symbol of symbols) {
      const cachedItem = cached?.find((c) => c.symbol === symbol);

      if (
        cachedItem &&
        now - new Date(cachedItem.updated_at).getTime() < CACHE_TTL_MS
      ) {
        // Cache hit — use it
        results.push(cachedItem.price as unknown as QuoteData);
      } else {
        // Cache miss or stale — need to fetch
        symbolsToFetch.push(symbol);
      }
    }

    // 2. Fetch missing/stale symbols from Finnhub
    for (const symbol of symbolsToFetch) {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
        );
        const data = await res.json();

        if (data.c && data.c > 0) {
          const quote: QuoteData = {
            symbol,
            price: data.c,
            change: data.d,
            changePercent: data.dp,
            high: data.h,
            low: data.l,
            open: data.o,
            prevClose: data.pc,
          };

          results.push(quote);

          // 3. Upsert into Supabase cache
          await supabase.from("market_cache").upsert(
            {
              symbol,
              price: quote,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "symbol" },
          );
        }
      } catch {
        // Skip failed symbols silently
        console.error(`Failed to fetch ${symbol}`);
      }
    }

    return NextResponse.json({
      prices: results,
      cached: results.length - symbolsToFetch.length,
    });
  } catch (error) {
    console.error("Market prices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}
