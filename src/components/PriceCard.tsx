"use client";

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

export default function PriceCard({ data }: { data: PriceData }) {
  const isPositive = data.change >= 0;

  return (
    <div
      className="glass-card group relative overflow-hidden p-5 transition-all duration-300"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isPositive
          ? "var(--success)"
          : "var(--danger)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--card-border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Glow line at top */}
      <div
        className="absolute left-0 top-0 h-[2px] w-full"
        style={{
          background: isPositive
            ? "linear-gradient(90deg, transparent, #22c55e, transparent)"
            : "linear-gradient(90deg, transparent, #ef4444, transparent)",
        }}
      />

      <div className="flex items-start justify-between">
        <div>
          <span
            className="text-sm font-bold tracking-wide"
            style={{ color: "var(--foreground)" }}
          >
            {data.symbol}
          </span>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            ${data.price.toFixed(2)}
          </p>
        </div>
        <div
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold"
          style={{
            background: isPositive
              ? "rgba(34, 197, 94, 0.12)"
              : "rgba(239, 68, 68, 0.12)",
            color: isPositive ? "var(--success)" : "var(--danger)",
          }}
        >
          <span>{isPositive ? "▲" : "▼"}</span>
          <span>{Math.abs(data.changePercent).toFixed(2)}%</span>
        </div>
      </div>

      <div
        className="mt-3 flex gap-4 text-xs"
        style={{ color: "var(--muted)" }}
      >
        <span>H: ${data.high.toFixed(2)}</span>
        <span>L: ${data.low.toFixed(2)}</span>
        <span
          className="tabular-nums"
          style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}
        >
          {isPositive ? "+" : ""}
          {data.change.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
