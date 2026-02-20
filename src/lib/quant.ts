import {
  multiply,
  transpose,
  mean,
  std,
  dotMultiply,
  sum,
  matrix,
} from "mathjs";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PortfolioAsset {
  symbol: string;
  weight: number; // 0–1
  expectedReturn: number; // annualized
}

export interface PortfolioMetrics {
  expectedReturn: number;
  variance: number;
  volatility: number;
  sharpeRatio: number;
  weights: { symbol: string; weight: number }[];
}

const RISK_FREE_RATE = 0.05; // 5% annual (approximate T-bill rate)

/**
 * Calculate daily returns from price history
 */
export function calculateDailyReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

/**
 * Calculate the covariance matrix from daily returns
 */
export function covarianceMatrix(returnsMatrix: number[][]): number[][] {
  const n = returnsMatrix.length; // number of assets
  const means = returnsMatrix.map((r) => mean(r) as number);
  const cov: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const demeaned_i = returnsMatrix[i].map((v) => v - means[i]);
      const demeaned_j = returnsMatrix[j].map((v) => v - means[j]);
      cov[i][j] =
        (sum(dotMultiply(demeaned_i, demeaned_j) as any) as unknown as number) /
        (returnsMatrix[i].length - 1);
    }
  }

  return cov;
}

/**
 * Calculate portfolio metrics given weights and return data
 */
export function calculatePortfolioMetrics(
  symbols: string[],
  weights: number[],
  dailyReturnsPerAsset: number[][],
): PortfolioMetrics {
  const n = symbols.length;

  // Annualized expected returns per asset (252 trading days)
  const annualReturns = dailyReturnsPerAsset.map(
    (r) => (mean(r) as number) * 252,
  );

  // Portfolio expected return: w' * mu
  const portfolioReturn = sum(
    dotMultiply(weights, annualReturns) as any,
  ) as unknown as number;

  // Covariance matrix (annualized)
  const covMatrix = covarianceMatrix(dailyReturnsPerAsset);
  const annualCov = covMatrix.map((row) => row.map((v) => v * 252));

  // Portfolio variance: w' * Σ * w
  const w = matrix(weights);
  const sigma = matrix(annualCov);
  const wSigma = multiply(w, sigma);
  const varianceResult = multiply(wSigma, transpose(matrix([weights])));
  const portfolioVariance = (
    typeof varianceResult === "number"
      ? varianceResult
      : (varianceResult as any).valueOf()
  ) as number;

  const volatility = Math.sqrt(portfolioVariance);

  // Sharpe ratio: (Rp - Rf) / σp
  const sharpeRatio =
    volatility > 0 ? (portfolioReturn - RISK_FREE_RATE) / volatility : 0;

  return {
    expectedReturn: portfolioReturn,
    variance: portfolioVariance,
    volatility,
    sharpeRatio,
    weights: symbols.map((symbol, i) => ({ symbol, weight: weights[i] })),
  };
}

/**
 * Simple equal-weight optimization as baseline
 */
export function equalWeightPortfolio(numAssets: number): number[] {
  return Array(numAssets).fill(1 / numAssets);
}

/**
 * Minimum variance portfolio (analytical solution for 2+ assets)
 * Uses inverse-variance weighting as approximation
 */
export function minVarianceWeights(dailyReturnsPerAsset: number[][]): number[] {
  const volatilities = dailyReturnsPerAsset.map(
    (r) => (std(r) as unknown as number) * Math.sqrt(252),
  );

  // Inverse-variance weighting
  const invVar = volatilities.map((v) => 1 / (v * v));
  const totalInvVar = invVar.reduce((a, b) => a + b, 0);

  return invVar.map((iv) => iv / totalInvVar);
}

/**
 * Max Sharpe ratio portfolio (grid search over weight space)
 * For simplicity, uses random sampling approach
 */
export function maxSharpeWeights(
  symbols: string[],
  dailyReturnsPerAsset: number[][],
  iterations: number = 5000,
): number[] {
  const n = symbols.length;
  let bestSharpe = -Infinity;
  let bestWeights = equalWeightPortfolio(n);

  for (let i = 0; i < iterations; i++) {
    // Generate random weights that sum to 1
    const rands = Array.from({ length: n }, () => Math.random());
    const total = sum(rands) as number;
    const weights = rands.map((r) => r / total);

    const metrics = calculatePortfolioMetrics(
      symbols,
      weights,
      dailyReturnsPerAsset,
    );

    if (metrics.sharpeRatio > bestSharpe) {
      bestSharpe = metrics.sharpeRatio;
      bestWeights = weights;
    }
  }

  return bestWeights;
}

/**
 * Generate simulated price data for demo/fallback
 */
export function generateMockPriceHistory(
  basePrice: number,
  days: number = 252,
): number[] {
  const prices: number[] = [basePrice];
  for (let i = 1; i < days; i++) {
    const dailyReturn = (Math.random() - 0.48) * 0.03; // slight positive drift
    prices.push(prices[i - 1] * (1 + dailyReturn));
  }
  return prices;
}
