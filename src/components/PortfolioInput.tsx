"use client";

import { useState } from "react";

const AVAILABLE_SYMBOLS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "JPM",
  "V",
  "JNJ",
  "WMT",
  "PG",
  "MA",
  "HD",
  "DIS",
  "BAC",
  "XOM",
  "PFE",
];

interface PortfolioInputProps {
  onSubmit: (assets: { symbol: string; weight: number }[]) => void;
  loading: boolean;
}

export default function PortfolioInput({
  onSubmit,
  loading,
}: PortfolioInputProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([
    "AAPL",
    "MSFT",
    "GOOGL",
  ]);
  const [weights, setWeights] = useState<Record<string, number>>({
    AAPL: 33.33,
    MSFT: 33.33,
    GOOGL: 33.34,
  });

  const toggleSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      if (selectedSymbols.length <= 2) return; // Minimum 2 assets
      const newSymbols = selectedSymbols.filter((s) => s !== symbol);
      setSelectedSymbols(newSymbols);
      const newWeights = { ...weights };
      delete newWeights[symbol];
      // Redistribute weights equally
      const equalWeight = 100 / newSymbols.length;
      newSymbols.forEach((s) => (newWeights[s] = equalWeight));
      setWeights(newWeights);
    } else {
      if (selectedSymbols.length >= 8) return; // Maximum 8 assets
      const newSymbols = [...selectedSymbols, symbol];
      setSelectedSymbols(newSymbols);
      const equalWeight = 100 / newSymbols.length;
      const newWeights: Record<string, number> = {};
      newSymbols.forEach((s) => (newWeights[s] = equalWeight));
      setWeights(newWeights);
    }
  };

  const updateWeight = (symbol: string, value: number) => {
    setWeights((prev) => ({ ...prev, [symbol]: value }));
  };

  const totalWeight = Object.values(weights)
    .filter((_, i) => selectedSymbols.includes(Object.keys(weights)[i]) || true)
    .reduce((sum, w) => {
      return sum;
    }, 0);

  const actualTotal = selectedSymbols.reduce(
    (sum, s) => sum + (weights[s] || 0),
    0,
  );

  const handleSubmit = () => {
    const assets = selectedSymbols.map((symbol) => ({
      symbol,
      weight: (weights[symbol] || 0) / 100,
    }));
    onSubmit(assets);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="mb-1 text-lg font-semibold">Select Assets</h3>
      <p className="mb-4 text-xs" style={{ color: "var(--muted)" }}>
        Pick 2–8 stocks for your portfolio
      </p>

      {/* Symbol Grid */}
      <div className="mb-6 flex flex-wrap gap-2">
        {AVAILABLE_SYMBOLS.map((symbol) => {
          const isSelected = selectedSymbols.includes(symbol);
          return (
            <button
              key={symbol}
              onClick={() => toggleSymbol(symbol)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background: isSelected ? "var(--accent)" : "var(--input-bg)",
                color: isSelected ? "white" : "var(--muted)",
                border: `1px solid ${isSelected ? "var(--accent)" : "var(--input-border)"}`,
              }}
            >
              {symbol}
            </button>
          );
        })}
      </div>

      {/* Weight Sliders */}
      <h3 className="mb-3 text-lg font-semibold">Allocation Weights</h3>
      <div className="flex flex-col gap-3">
        {selectedSymbols.map((symbol) => (
          <div key={symbol} className="flex items-center gap-3">
            <span className="w-14 text-sm font-bold">{symbol}</span>
            <input
              type="range"
              min="1"
              max="80"
              value={weights[symbol] || 0}
              onChange={(e) => updateWeight(symbol, parseFloat(e.target.value))}
              className="flex-1"
              style={{ accentColor: "var(--accent)" }}
            />
            <span
              className="w-14 text-right text-sm tabular-nums"
              style={{ color: "var(--muted)" }}
            >
              {(weights[symbol] || 0).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Total + Submit */}
      <div className="mt-5 flex items-center justify-between">
        <span
          className="text-sm font-medium"
          style={{
            color:
              Math.abs(actualTotal - 100) < 1
                ? "var(--success)"
                : "var(--danger)",
          }}
        >
          Total: {actualTotal.toFixed(1)}%
          {Math.abs(actualTotal - 100) >= 1 && " (should be ~100%)"}
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || selectedSymbols.length < 2}
          className="btn-primary !px-6 !py-2.5 text-sm"
        >
          {loading ? "Optimizing…" : "⚡ Optimize Portfolio"}
        </button>
      </div>
    </div>
  );
}
