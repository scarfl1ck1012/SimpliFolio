"use client";

import { PortfolioMetrics } from "@/lib/quant";

interface PortfolioResultsProps {
  metrics: PortfolioMetrics;
  optimizedMetrics?: PortfolioMetrics;
}

function MetricCard({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: string;
  suffix?: string;
  color?: string;
}) {
  return (
    <div className="glass-card p-4 text-center">
      <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-2xl font-bold tabular-nums"
        style={{ color: color || "var(--foreground)" }}
      >
        {value}
        {suffix && <span className="ml-0.5 text-sm font-medium">{suffix}</span>}
      </p>
    </div>
  );
}

function WeightBar({ symbol, weight }: { symbol: string; weight: number }) {
  const pct = (weight * 100).toFixed(1);
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-sm font-bold">{symbol}</span>
      <div
        className="relative h-6 flex-1 overflow-hidden rounded-full"
        style={{ background: "var(--input-bg)" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.max(weight * 100, 2)}%`,
            background: "linear-gradient(90deg, var(--accent), #8b5cf6)",
          }}
        />
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}

export default function PortfolioResults({
  metrics,
  optimizedMetrics,
}: PortfolioResultsProps) {
  const sharpeColor =
    metrics.sharpeRatio > 1
      ? "var(--success)"
      : metrics.sharpeRatio > 0
        ? "var(--accent-hover)"
        : "var(--danger)";

  return (
    <div className="flex flex-col gap-6">
      {/* Your Portfolio Metrics */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">📊 Your Portfolio</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Expected Return"
            value={(metrics.expectedReturn * 100).toFixed(2)}
            suffix="%"
            color={
              metrics.expectedReturn > 0 ? "var(--success)" : "var(--danger)"
            }
          />
          <MetricCard
            label="Volatility"
            value={(metrics.volatility * 100).toFixed(2)}
            suffix="%"
          />
          <MetricCard
            label="Variance"
            value={(metrics.variance * 100).toFixed(4)}
          />
          <MetricCard
            label="Sharpe Ratio"
            value={metrics.sharpeRatio.toFixed(3)}
            color={sharpeColor}
          />
        </div>
      </div>

      {/* Weight Allocation */}
      <div className="glass-card p-5">
        <h4
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--muted)" }}
        >
          Your Allocation
        </h4>
        <div className="flex flex-col gap-2">
          {metrics.weights.map((w) => (
            <WeightBar key={w.symbol} symbol={w.symbol} weight={w.weight} />
          ))}
        </div>
      </div>

      {/* Optimized Portfolio (if different) */}
      {optimizedMetrics && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">
            ⚡ <span className="gradient-text">Optimized Portfolio</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Expected Return"
              value={(optimizedMetrics.expectedReturn * 100).toFixed(2)}
              suffix="%"
              color={
                optimizedMetrics.expectedReturn > 0
                  ? "var(--success)"
                  : "var(--danger)"
              }
            />
            <MetricCard
              label="Volatility"
              value={(optimizedMetrics.volatility * 100).toFixed(2)}
              suffix="%"
            />
            <MetricCard
              label="Variance"
              value={(optimizedMetrics.variance * 100).toFixed(4)}
            />
            <MetricCard
              label="Sharpe Ratio"
              value={optimizedMetrics.sharpeRatio.toFixed(3)}
              color={
                optimizedMetrics.sharpeRatio > 1
                  ? "var(--success)"
                  : optimizedMetrics.sharpeRatio > 0
                    ? "var(--accent-hover)"
                    : "var(--danger)"
              }
            />
          </div>

          {/* Optimized Weights */}
          <div className="glass-card mt-3 p-5">
            <h4
              className="mb-3 text-sm font-semibold"
              style={{ color: "var(--muted)" }}
            >
              Suggested Allocation (Max Sharpe)
            </h4>
            <div className="flex flex-col gap-2">
              {optimizedMetrics.weights.map((w) => (
                <WeightBar key={w.symbol} symbol={w.symbol} weight={w.weight} />
              ))}
            </div>
          </div>

          {/* Improvement Badge */}
          {optimizedMetrics.sharpeRatio > metrics.sharpeRatio && (
            <div
              className="mt-4 rounded-xl p-4 text-center text-sm font-medium"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                color: "var(--success)",
              }}
            >
              ✨ Optimized portfolio improves Sharpe ratio by{" "}
              {(
                ((optimizedMetrics.sharpeRatio - metrics.sharpeRatio) /
                  Math.abs(metrics.sharpeRatio || 1)) *
                100
              ).toFixed(1)}
              %
            </div>
          )}
        </div>
      )}
    </div>
  );
}
