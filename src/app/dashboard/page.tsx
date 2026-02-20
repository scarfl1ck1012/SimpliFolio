"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import PriceCard from "@/components/PriceCard";
import NewsFeed from "@/components/NewsFeed";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const { data: priceData, isLoading: pricesLoading } = useSWR(
    user ? "/api/market/prices?symbols=AAPL,MSFT,GOOGL,AMZN,TSLA,NVDA" : null,
    fetcher,
    { refreshInterval: 5 * 60 * 1000 }, // Auto-refresh every 5 min
  );

  const { data: newsData, isLoading: newsLoading } = useSWR(
    user ? "/api/market/news" : null,
    fetcher,
    { refreshInterval: 10 * 60 * 1000 }, // Auto-refresh every 10 min
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

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
      {/* Top Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(11, 15, 26, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <h1 className="gradient-text text-xl font-bold">SimpliFolio</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            {user.email}
          </span>
          <button
            onClick={signOut}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style={{
              border: "1px solid var(--card-border)",
              color: "var(--muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--danger)";
              e.currentTarget.style.color = "var(--danger)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--card-border)";
              e.currentTarget.style.color = "var(--muted)";
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Welcome */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back{" "}
              <span className="gradient-text">{user.email?.split("@")[0]}</span>
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Your portfolio dashboard — live market data
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/optimizer")}
            className="btn-primary !px-5 !py-2.5 text-sm"
          >
            ⚡ Optimize Portfolio
          </button>
        </div>

        {/* Live Prices Section */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">📈 Live Prices</h3>
            {priceData?.cached !== undefined && (
              <span
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  background: "var(--accent-glow)",
                  color: "var(--accent-hover)",
                }}
              >
                {priceData.cached} cached ·{" "}
                {priceData.prices?.length - priceData.cached} fresh
              </span>
            )}
          </div>

          {pricesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card h-28 animate-pulse"
                  style={{ background: "var(--input-bg)" }}
                />
              ))}
            </div>
          ) : priceData?.prices?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {priceData.prices.map(
                (quote: {
                  symbol: string;
                  price: number;
                  change: number;
                  changePercent: number;
                  high: number;
                  low: number;
                }) => (
                  <PriceCard key={quote.symbol} data={quote} />
                ),
              )}
            </div>
          ) : (
            <div
              className="glass-card p-6 text-center text-sm"
              style={{ color: "var(--muted)" }}
            >
              Unable to load market data. Check your API key.
            </div>
          )}
        </section>

        {/* News Section */}
        <section className="mb-10">
          <h3 className="mb-4 text-lg font-semibold">📰 Market News</h3>
          {newsLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card h-24 animate-pulse"
                  style={{ background: "var(--input-bg)" }}
                />
              ))}
            </div>
          ) : (
            <NewsFeed articles={newsData?.articles || []} />
          )}
        </section>

        {/* Upcoming Features */}
        <section>
          <h3 className="mb-4 text-lg font-semibold">🚀 Coming Soon</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "🧠 AI Explanations",
                desc: "ELI5 breakdowns of your portfolio",
                phase: "Phase 5",
              },
              {
                title: "📚 Learning Modules",
                desc: "Master investing fundamentals",
                phase: "Phase 6",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="glass-card flex flex-col justify-between p-5 transition-all duration-300"
                style={{ opacity: 0.6 }}
              >
                <div>
                  <h4 className="text-base font-semibold">{card.title}</h4>
                  <p
                    className="mt-1.5 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {card.desc}
                  </p>
                </div>
                <span
                  className="mt-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: "var(--accent-glow)",
                    color: "var(--accent-hover)",
                  }}
                >
                  {card.phase}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
