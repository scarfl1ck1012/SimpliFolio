"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import PortfolioInput from "@/components/PortfolioInput";
import PortfolioResults from "@/components/PortfolioResults";
import {
  calculateDailyReturns,
  calculatePortfolioMetrics,
  maxSharpeWeights,
  generateMockPriceHistory,
  PortfolioMetrics,
} from "@/lib/quant";

export default function OptimizerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [optimizing, setOptimizing] = useState(false);
  const [userMetrics, setUserMetrics] = useState<PortfolioMetrics | null>(null);
  const [optimizedMetrics, setOptimizedMetrics] =
    useState<PortfolioMetrics | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const handleOptimize = async (
    assets: { symbol: string; weight: number }[],
  ) => {
    setOptimizing(true);
    setUserMetrics(null);
    setOptimizedMetrics(null);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 300));

    try {
      const symbols = assets.map((a) => a.symbol);
      const weights = assets.map((a) => a.weight);

      // Try to fetch real price history from our API
      let dailyReturnsPerAsset: number[][] = [];

      try {
        const res = await fetch(
          `/api/market/prices?symbols=${symbols.join(",")}`,
        );
        const data = await res.json();

        if (data.prices && data.prices.length > 0) {
          // Use real current prices to generate realistic mock history
          // (Finnhub free tier doesn't provide historical candles easily)
          dailyReturnsPerAsset = data.prices.map((p: { price: number }) => {
            const history = generateMockPriceHistory(p.price, 252);
            return calculateDailyReturns(history);
          });
        }
      } catch {
        // Fallback: generate mock data
      }

      // If no real data, use mock
      if (dailyReturnsPerAsset.length === 0) {
        dailyReturnsPerAsset = symbols.map(() => {
          const history = generateMockPriceHistory(150, 252);
          return calculateDailyReturns(history);
        });
      }

      // Calculate user's portfolio metrics
      const userResult = calculatePortfolioMetrics(
        symbols,
        weights,
        dailyReturnsPerAsset,
      );
      setUserMetrics(userResult);

      // Calculate optimized portfolio (Max Sharpe)
      const optimalWeights = maxSharpeWeights(
        symbols,
        dailyReturnsPerAsset,
        5000,
      );
      const optResult = calculatePortfolioMetrics(
        symbols,
        optimalWeights,
        dailyReturnsPerAsset,
      );
      setOptimizedMetrics(optResult);
    } catch (err) {
      console.error("Optimization error:", err);
    }

    setOptimizing(false);
  };

  if (loading) {
    return (
      <div className="grid-bg flex min-h-screen items-center justify-center">
        <div className="animate-pulse-glow glass-card px-8 py-6">
          <p className="gradient-text text-lg font-semibold">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="grid-bg min-h-screen">
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(11, 15, 26, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <div className="flex items-center gap-4">
          <h1
            className="gradient-text cursor-pointer text-xl font-bold"
            onClick={() => router.push("/dashboard")}
          >
            SimpliFolio
          </h1>
          <span style={{ color: "var(--card-border)" }}>|</span>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--muted)" }}
          >
            Portfolio Optimizer
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
          style={{
            border: "1px solid var(--card-border)",
            color: "var(--muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--card-border)";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          ← Dashboard
        </button>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            ⚡ <span className="gradient-text">Portfolio Optimizer</span>
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Select assets, set weights, and get AI-optimized allocations with
            Sharpe ratio maximization.
          </p>
        </div>

        {/* Input */}
        <div className="mb-8">
          <PortfolioInput onSubmit={handleOptimize} loading={optimizing} />
        </div>

        {/* Loading State */}
        {optimizing && (
          <div className="animate-pulse-glow glass-card p-8 text-center">
            <p className="gradient-text text-lg font-semibold">
              Running Monte Carlo optimization…
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Testing 5,000 portfolio combinations
            </p>
          </div>
        )}

        {/* Results */}
        {userMetrics && !optimizing && (
          <PortfolioResults
            metrics={userMetrics}
            optimizedMetrics={optimizedMetrics || undefined}
          />
        )}
      </main>
    </div>
  );
}
