export type Sentiment = 'bullish' | 'bearish' | 'neutral';

export type MarketRelevance = 'low' | 'medium' | 'high';

export type TradingEvent =
  | 'earnings'
  | 'merger_acquisition'
  | 'regulation'
  | 'interest_rate'
  | 'partnership'
  | 'ai_breakthrough'
  | 'large_contract'
  | 'disruption'
  | 'lawsuit'
  | 'market_crash_rally';

export const tradingEventLabels: Record<TradingEvent, string> = {
  earnings: 'Earnings',
  merger_acquisition: 'M&A',
  regulation: 'Regulation',
  interest_rate: 'Rate Decision',
  partnership: 'Partnership',
  ai_breakthrough: 'AI Breakthrough',
  large_contract: 'Large Contract',
  disruption: 'Disruption',
  lawsuit: 'Lawsuit',
  market_crash_rally: 'Market Move',
};

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: Date;
  sentiment: Sentiment;
  sentimentScore: number; // -1 to 1
  tickers: string[];
  sectors: string[];
  companies: string[];
  isBreaking: boolean;
  url: string;
  imageUrl?: string;
  impactScore: number; // 0-100
  marketRelevance: MarketRelevance;
  tradingEvents: TradingEvent[];
}

export interface SentimentOverview {
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
  bullishPercentage: number;
  bearishPercentage: number;
  avgImpactScore: number;
  highImpactCount: number;
}
