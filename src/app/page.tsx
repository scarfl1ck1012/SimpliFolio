"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="grid-bg relative flex min-h-screen flex-col">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="animate-float absolute -left-48 top-1/4 h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          }}
        />
        <div
          className="animate-float absolute -right-48 bottom-1/4 h-[600px] w-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <h1 className="gradient-text text-xl font-bold tracking-tight">
          SimpliFolio
        </h1>
        <button
          onClick={() => router.push(user ? "/dashboard" : "/auth")}
          className="btn-primary !px-5 !py-2.5 text-sm"
        >
          {user ? "Dashboard" : "Get Started"}
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
          style={{
            background: "var(--accent-glow)",
            color: "var(--accent-hover)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          AI-Powered Portfolio Optimization
        </div>

        <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Smarter investing, <span className="gradient-text">simplified.</span>
        </h2>

        <p
          className="mt-6 max-w-xl text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--muted)" }}
        >
          Get live market data, AI-optimized portfolio allocations, and
          beginner-friendly explanations — all in one place.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => router.push(user ? "/dashboard" : "/auth")}
            className="btn-primary text-base"
          >
            {user ? "Go to Dashboard" : "Start Free →"}
          </button>
          <a
            href="#features"
            className="rounded-xl px-8 py-3 text-base font-medium transition-all"
            style={{
              border: "1px solid var(--card-border)",
              color: "var(--muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--card-border)";
              e.currentTarget.style.color = "var(--muted)";
            }}
          >
            See Features
          </a>
        </div>

        {/* Feature grid */}
        <div
          id="features"
          className="mt-24 grid w-full max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              icon: "📊",
              title: "Live Market Data",
              desc: "Real-time prices and news with smart API caching",
            },
            {
              icon: "⚡",
              title: "Quant Optimizer",
              desc: "Sharpe ratio, variance, and optimal weight allocation",
            },
            {
              icon: "🧠",
              title: "AI Explanations",
              desc: "Complex metrics explained in plain English",
            },
            {
              icon: "📚",
              title: "Learning Modules",
              desc: "Master investing basics with beginner-friendly lessons",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass-card p-6 text-left transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 py-8 text-center text-xs"
        style={{ color: "var(--muted)" }}
      >
        Built with Next.js, Supabase & AI — SimpliFolio © 2026
      </footer>
    </div>
  );
}
