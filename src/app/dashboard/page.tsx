"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

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
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            Welcome back
            <span className="gradient-text ml-1">
              {user.email?.split("@")[0]}
            </span>
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Your portfolio dashboard — features coming in next phases.
          </p>
        </div>

        {/* Placeholder Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "📈 Live Prices",
              desc: "Real-time market data with smart caching",
              phase: "Phase 3",
            },
            {
              title: "📰 Market News",
              desc: "Latest financial news at a glance",
              phase: "Phase 3",
            },
            {
              title: "⚡ Portfolio Optimizer",
              desc: "AI-powered allocation with Sharpe ratio",
              phase: "Phase 4",
            },
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
            {
              title: "⚙️ Settings",
              desc: "Customize your dashboard experience",
              phase: "Phase 3",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-card flex flex-col justify-between p-6 transition-all duration-300"
              style={{ cursor: "default" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 20px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {card.desc}
                </p>
              </div>
              <span
                className="mt-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium"
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
      </main>
    </div>
  );
}
