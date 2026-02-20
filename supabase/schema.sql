-- SimpliFolio: Supabase Table Setup
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. user_settings: stores per-user dashboard customization
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  show_prices BOOLEAN DEFAULT TRUE,
  show_news BOOLEAN DEFAULT TRUE,
  show_learning BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. market_cache: caches market data to avoid API rate limits
CREATE TABLE IF NOT EXISTS market_cache (
  symbol TEXT PRIMARY KEY,
  price NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. portfolio_inputs: stores user portfolio configurations
CREATE TABLE IF NOT EXISTS portfolio_inputs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assets TEXT[] NOT NULL,
  weights NUMERIC[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_inputs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own data
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own portfolios" ON portfolio_inputs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolios" ON portfolio_inputs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON portfolio_inputs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolios" ON portfolio_inputs FOR DELETE USING (auth.uid() = user_id);

-- market_cache is publicly readable (no auth needed for cached prices)
ALTER TABLE market_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Market cache is publicly readable" ON market_cache FOR SELECT USING (true);
