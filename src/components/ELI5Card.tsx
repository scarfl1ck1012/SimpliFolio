"use client";

import { useState } from "react";
import { PortfolioMetrics } from "@/lib/quant";

interface ELI5CardProps {
  userMetrics: PortfolioMetrics;
  optimizedMetrics?: PortfolioMetrics;
}

export default function ELI5Card({
  userMetrics,
  optimizedMetrics,
}: ELI5CardProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchExplanation = async () => {
    setLoading(true);
    setError(false);
    setExplanation(null);

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedReturn: userMetrics.expectedReturn,
          volatility: userMetrics.volatility,
          variance: userMetrics.variance,
          sharpeRatio: userMetrics.sharpeRatio,
          weights: userMetrics.weights,
          optimizedSharpe: optimizedMetrics?.sharpeRatio,
        }),
      });

      const data = await res.json();

      if (data.explanation) {
        setExplanation(data.explanation);
        setProvider(data.provider);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  // Fallback: show raw metrics in plain English
  const renderFallback = () => {
    const ret = (userMetrics.expectedReturn * 100).toFixed(2);
    const vol = (userMetrics.volatility * 100).toFixed(2);
    const sharpe = userMetrics.sharpeRatio.toFixed(3);
    const isGood = userMetrics.sharpeRatio > 0.5;

    return (
      <div className="glass-card p-6">
        <h3 className="mb-3 text-lg font-semibold">📋 Portfolio Summary</h3>
        <div
          className="flex flex-col gap-2 text-sm"
          style={{ color: "var(--muted)" }}
        >
          <p>
            Your portfolio is expected to return{" "}
            <span style={{ color: "var(--foreground)" }}>{ret}%</span> per year
            with a risk level of{" "}
            <span style={{ color: "var(--foreground)" }}>{vol}%</span>.
          </p>
          <p>
            The Sharpe ratio of{" "}
            <span
              style={{
                color: isGood ? "var(--success)" : "var(--danger)",
              }}
            >
              {sharpe}
            </span>{" "}
            means your return {isGood ? "adequately" : "may not adequately"}{" "}
            compensates for the risk taken.
          </p>
          <p className="mt-2 text-xs italic" style={{ color: "var(--muted)" }}>
            AI explanation unavailable — showing raw analysis.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      {/* Generate button */}
      {!explanation && !loading && !error && (
        <button
          onClick={fetchExplanation}
          className="btn-primary w-full text-center"
        >
          🧠 Explain My Portfolio (AI)
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="animate-pulse-glow glass-card p-6 text-center">
          <p className="gradient-text text-base font-semibold">
            AI is analyzing your portfolio…
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Generating beginner-friendly explanation
          </p>
        </div>
      )}

      {/* AI Explanation */}
      {explanation && (
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
              borderBottom: "1px solid var(--card-border)",
            }}
          >
            <h3 className="text-base font-semibold">
              🧠 <span className="gradient-text">AI Explanation</span>
            </h3>
            {provider && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  background: "var(--accent-glow)",
                  color: "var(--accent-hover)",
                }}
              >
                via {provider}
              </span>
            )}
          </div>
          {/* Content */}
          <div className="px-6 py-5">
            <div
              className="whitespace-pre-line text-sm leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {explanation}
            </div>
          </div>
          {/* Regenerate */}
          <div
            className="flex justify-end px-6 py-3"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            <button
              onClick={fetchExplanation}
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--muted)")
              }
            >
              ↻ Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Error fallback */}
      {error && renderFallback()}
    </div>
  );
}
