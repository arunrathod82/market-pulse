export type Sentiment = 'bullish' | 'bearish' | 'neutral';

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
  isBreaking: boolean;
  url: string;
  imageUrl?: string;
}

export interface SentimentOverview {
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
  bullishPercentage: number;
  bearishPercentage: number;
}
