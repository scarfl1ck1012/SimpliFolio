"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

/* ------------------------------------------------------------------ */
/*  Static lesson data                                                 */
/* ------------------------------------------------------------------ */

interface Lesson {
  id: number;
  icon: string;
  title: string;
  desc: string;
  difficulty: "Beginner" | "Intermediate";
  readMin: number;
  content: string[];
  takeaway: string;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    icon: "📈",
    title: "What Is a Stock?",
    desc: "Shares, ownership, and why prices move",
    difficulty: "Beginner",
    readMin: 3,
    content: [
      "🏢 **Owning a Tiny Piece of a Company** — When you buy a stock, you're buying a small slice of a real business. If Apple has millions of shares and you own one, you literally own a fraction of Apple — its products, profits, and future.",
      "💰 **Why Prices Move** — Stock prices change every second because buyers and sellers constantly negotiate. If more people want to buy a stock than sell it, the price goes up — like a popular concert ticket. If more people want to sell, the price drops.",
      "📊 **Reading a Stock Quote** — A stock quote shows the current price, how much it changed today (in dollars and percent), and the day's high and low. Green means the price went up; red means it went down. That's it — no PhD required!",
      "🌍 **Why Companies Sell Stocks** — Companies sell shares to raise money without taking on debt. Instead of borrowing from a bank, they let the public invest. In return, investors hope the company grows and their shares become worth more over time.",
    ],
    takeaway:
      "A stock = a tiny ownership stake in a company. Prices move based on supply and demand. You don't need to be an expert to get started — just understand the basics!",
  },
  {
    id: 2,
    icon: "⚖️",
    title: "Risk vs. Return",
    desc: "Volatility, diversification, and why balance matters",
    difficulty: "Beginner",
    readMin: 4,
    content: [
      '🎢 **What Is Risk?** — In investing, risk means uncertainty. A "risky" stock can shoot up 30% or crash 30% in a month. A "safe" government bond might return only 3% per year — but it almost never loses your money. Higher potential reward usually comes with higher potential loss.',
      '📐 **Volatility: The Risk Ruler** — Volatility measures how wildly a stock\'s price swings. Think of it like the difference between a calm lake and ocean waves. Low volatility = calm. High volatility = big waves. Neither is "bad" — it depends on how much turbulence you can handle.',
      "🧺 **Don't Put All Your Eggs in One Basket** — Diversification means spreading your money across different stocks or asset types. If one stock tanks, others might hold steady or go up. It's the simplest way to reduce risk without needing to predict the future.",
      "🎯 **Finding Your Balance** — Every investor has a different comfort level. A 25-year-old saving for retirement can tolerate more risk than someone retiring next year. The key is choosing a mix of investments that lets you sleep at night AND grow your wealth.",
    ],
    takeaway:
      "Risk and return are two sides of the same coin. Diversify your holdings, understand your comfort level, and remember: time in the market beats timing the market.",
  },
  {
    id: 3,
    icon: "🗂️",
    title: "Understanding Portfolios",
    desc: "What a portfolio is and why allocation matters",
    difficulty: "Beginner",
    readMin: 3,
    content: [
      "📁 **Your Financial Playlist** — A portfolio is simply the collection of all your investments. Think of it like a music playlist — each song (stock) contributes to the overall vibe (performance). A good playlist has variety; a good portfolio has diversified holdings.",
      '⚖️ **Allocation = How You Split Your Money** — If you invest $1,000, putting $500 in Tech and $500 in Healthcare is a 50/50 allocation. The way you divide your money across assets matters MORE than picking the "perfect" stock. Studies show asset allocation explains over 90% of portfolio performance.',
      "🔄 **Rebalancing: Staying on Track** — Over time, some stocks grow faster than others, shifting your allocation. If Tech grows from 50% to 70%, your portfolio is riskier than planned. Rebalancing means selling some winners and buying some laggards to get back to your target mix.",
      "🎯 **What SimpliFolio Does for You** — Our optimizer takes your assets, runs thousands of combinations, and finds the allocation that gives you the best return for the least risk. No manual math needed!",
    ],
    takeaway:
      "A portfolio is your collection of investments. How you split your money (allocation) matters more than any single stock pick. Rebalance periodically to stay on track.",
  },
  {
    id: 4,
    icon: "📏",
    title: "The Sharpe Ratio Explained",
    desc: "Risk-adjusted returns in plain English",
    difficulty: "Intermediate",
    readMin: 4,
    content: [
      '🤔 **The Big Question** — If Fund A returns 20% and Fund B returns 10%, is Fund A better? Not necessarily! What if Fund A is a wild rollercoaster and Fund B is a smooth ride? The Sharpe Ratio answers: "How much return am I getting for each unit of risk?"',
      '📐 **The Formula (Simplified)** — Sharpe Ratio = (Portfolio Return − Risk-Free Rate) / Portfolio Volatility. The "risk-free rate" is what you\'d earn from a safe government bond (~4-5%). Volatility is how bumpy the ride is. A higher Sharpe = more reward per unit of risk.',
      "🏆 **What's a Good Sharpe Ratio?** — Below 1.0 = the risk might not be worth the reward. Between 1.0 and 2.0 = solid risk-adjusted performance. Above 2.0 = exceptional (and rare for long periods). Most diversified portfolios aim for 0.5 to 1.5.",
      '⚡ **Why SimpliFolio Uses It** — Our Monte Carlo optimizer tests 5,000 random portfolio combinations and picks the one with the highest Sharpe Ratio. That\'s the mathematically "best" balance between chasing returns and managing risk — and you get it in one click.',
    ],
    takeaway:
      "The Sharpe Ratio measures return per unit of risk. Higher is better. SimpliFolio's optimizer maximizes this ratio to find your ideal portfolio allocation.",
  },
  {
    id: 5,
    icon: "🧠",
    title: "How Portfolio Optimization Works",
    desc: "Monte Carlo simulation and what SimpliFolio does under the hood",
    difficulty: "Intermediate",
    readMin: 5,
    content: [
      "🎲 **Monte Carlo: Not Just a Casino** — Monte Carlo simulation is a technique where you generate thousands of random scenarios to find the best outcome. Named after the famous casino, it's used in finance, engineering, and even weather forecasting. Instead of guessing one allocation, it tests thousands.",
      '🔬 **What Happens When You Click "Optimize"** — SimpliFolio generates 5,000 random weight combinations for your selected stocks. For each combo, it calculates the expected return, volatility, and Sharpe Ratio. Then it picks the combination with the highest Sharpe Ratio — the one offering the best risk-adjusted return.',
      "📊 **Your Portfolio vs. Optimized** — After optimization, you see two sets of metrics side by side: your original allocation and the mathematically optimal one. This lets you compare exactly how much improvement is possible by tweaking your weights — without adding or removing any stocks.",
      '🤖 **AI Makes It Click** — Raw numbers like "Sharpe 1.32" or "Volatility 18.4%" can feel abstract. That\'s why SimpliFolio sends the results to an AI (Groq or Gemini) that translates the math into a plain-English "Explain Like I\'m 5" summary — complete with analogies and emojis.',
      "🚀 **The Takeaway for You** — You don't need a finance degree or a Bloomberg terminal. Enter your stocks, set your weights, and let the math + AI do the heavy lifting. Use the results as a starting point for smarter allocation decisions.",
    ],
    takeaway:
      "SimpliFolio runs 5,000 random portfolio combinations, picks the best risk-adjusted one (highest Sharpe Ratio), and uses AI to explain it in plain English. Math + AI = smarter investing.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LearnPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
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

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

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
            Learning Modules
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
            📚 <span className="gradient-text">Learning Modules</span>
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Master the fundamentals of investing — no jargon, just plain
            English.
          </p>
        </div>

        {/* Progress indicator */}
        <div
          className="glass-card mb-8 flex items-center gap-4 px-5 py-4"
          style={{ borderColor: "var(--accent)", borderWidth: "1px" }}
        >
          <div className="text-2xl">🎯</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {LESSONS.length} modules available
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              ~{LESSONS.reduce((s, l) => s + l.readMin, 0)} min total read time
              · Beginner → Intermediate
            </p>
          </div>
        </div>

        {/* Module cards */}
        <div className="flex flex-col gap-4">
          {LESSONS.map((lesson) => {
            const isOpen = openId === lesson.id;

            return (
              <div
                key={lesson.id}
                className="glass-card overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isOpen ? "var(--accent)" : "var(--card-border)",
                }}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => toggle(lesson.id)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors"
                  style={{ background: "transparent" }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{
                      background: "var(--accent-glow)",
                    }}
                  >
                    {lesson.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold">{lesson.title}</h3>
                    <p
                      className="mt-0.5 text-sm truncate"
                      style={{ color: "var(--muted)" }}
                    >
                      {lesson.desc}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background:
                          lesson.difficulty === "Beginner"
                            ? "rgba(34, 197, 94, 0.15)"
                            : "rgba(251, 191, 36, 0.15)",
                        color:
                          lesson.difficulty === "Beginner"
                            ? "#22c55e"
                            : "#fbbf24",
                      }}
                    >
                      {lesson.difficulty}
                    </span>
                    <span
                      className="text-xs whitespace-nowrap"
                      style={{ color: "var(--muted)" }}
                    >
                      {lesson.readMin} min
                    </span>
                  </div>

                  {/* Chevron */}
                  <span
                    className="ml-2 text-lg transition-transform duration-300"
                    style={{
                      color: "var(--muted)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▾
                  </span>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div
                    className="px-5 pb-6"
                    style={{
                      borderTop: "1px solid var(--card-border)",
                    }}
                  >
                    <div className="mt-5 flex flex-col gap-4">
                      {lesson.content.map((para, i) => {
                        // Split on first ** pair for bold header
                        const parts = para.match(/^(.*?)\*\*(.*?)\*\*(.*)$/);
                        return (
                          <div key={i}>
                            {parts ? (
                              <p
                                className="text-sm leading-relaxed"
                                style={{ color: "var(--foreground)" }}
                              >
                                {parts[1]}
                                <strong
                                  style={{ color: "var(--accent-hover)" }}
                                >
                                  {parts[2]}
                                </strong>
                                {parts[3]}
                              </p>
                            ) : (
                              <p
                                className="text-sm leading-relaxed"
                                style={{ color: "var(--foreground)" }}
                              >
                                {para}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Key Takeaway box */}
                    <div
                      className="mt-6 rounded-xl p-4"
                      style={{
                        background: "var(--accent-glow)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                      }}
                    >
                      <p
                        className="mb-1 text-xs font-bold uppercase tracking-wider"
                        style={{ color: "var(--accent-hover)" }}
                      >
                        💡 Key Takeaway
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--foreground)" }}
                      >
                        {lesson.takeaway}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA at bottom */}
        <div className="mt-10 text-center">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Ready to apply what you learned?
          </p>
          <button
            onClick={() => router.push("/dashboard/optimizer")}
            className="btn-primary mt-3 !px-6 !py-3 text-sm"
          >
            ⚡ Try the Portfolio Optimizer
          </button>
        </div>
      </main>
    </div>
  );
}
