
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  exchange TEXT NOT NULL DEFAULT 'NYSE',
  sector TEXT NOT NULL DEFAULT 'General',
  market_cap TEXT NOT NULL DEFAULT 'large',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are publicly readable" ON public.companies FOR SELECT USING (true);

-- Articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  url TEXT,
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
  sentiment_score NUMERIC NOT NULL DEFAULT 0,
  impact_score INTEGER NOT NULL DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 100),
  market_relevance TEXT NOT NULL DEFAULT 'low' CHECK (market_relevance IN ('low', 'medium', 'high')),
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  tickers TEXT[] NOT NULL DEFAULT '{}',
  companies TEXT[] NOT NULL DEFAULT '{}',
  sectors TEXT[] NOT NULL DEFAULT '{}',
  trading_events TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles are publicly readable" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Service role can insert articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update articles" ON public.articles FOR UPDATE USING (true);

CREATE INDEX idx_articles_impact_score ON public.articles (impact_score DESC);
CREATE INDEX idx_articles_published_at ON public.articles (published_at DESC);
CREATE INDEX idx_articles_sentiment ON public.articles (sentiment);
CREATE INDEX idx_articles_tickers ON public.articles USING GIN (tickers);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  company_symbol TEXT,
  alert_type TEXT NOT NULL DEFAULT 'high_impact' CHECK (alert_type IN ('breaking', 'high_impact', 'bullish_signal', 'bearish_signal')),
  impact_score INTEGER NOT NULL DEFAULT 0,
  dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alerts are publicly readable" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Service role can insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update alerts" ON public.alerts FOR UPDATE USING (true);

CREATE INDEX idx_alerts_created_at ON public.alerts (created_at DESC);

-- Enable realtime for articles and alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
