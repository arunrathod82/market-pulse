import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle, SentimentOverview, Sentiment, MarketRelevance, TradingEvent } from '@/types/news';

const MIN_IMPACT_SCORE = 60;

function mapDbArticle(row: any): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    source: row.source,
    timestamp: new Date(row.published_at),
    sentiment: row.sentiment as Sentiment,
    sentimentScore: Number(row.sentiment_score),
    tickers: row.tickers || [],
    sectors: row.sectors || [],
    companies: row.companies || [],
    isBreaking: row.is_breaking,
    url: row.url || '#',
    impactScore: row.impact_score,
    marketRelevance: row.market_relevance as MarketRelevance,
    tradingEvents: (row.trading_events || []) as TradingEvent[],
  };
}

export function useNewsStream() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [latestAlert, setLatestAlert] = useState<NewsArticle | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const alertTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch initial articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .gte('impact_score', MIN_IMPACT_SCORE)
        .order('published_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching articles:', error);
      } else if (data) {
        setArticles(data.map(mapDbArticle));
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, []);

  // Subscribe to real-time inserts
  useEffect(() => {
    const channel = supabase
      .channel('articles-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'articles' },
        (payload) => {
          const newArticle = mapDbArticle(payload.new);
          if (newArticle.impactScore < MIN_IMPACT_SCORE) return;

          setArticles(prev => [newArticle, ...prev].slice(0, 50));

          if (newArticle.isBreaking || newArticle.impactScore >= 80) {
            setLatestAlert(newArticle);
            setShowAlert(true);
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
            alertTimeoutRef.current = setTimeout(() => setShowAlert(false), 8000);

            if ('Notification' in window && Notification.permission === 'granted') {
              const icon = newArticle.sentiment === 'bullish' ? '📈' : newArticle.sentiment === 'bearish' ? '📉' : '📊';
              new Notification(`${icon} Impact ${newArticle.impactScore} — ${newArticle.sentiment === 'bullish' ? 'Bullish' : newArticle.sentiment === 'bearish' ? 'Bearish' : 'Market'} Alert`, {
                body: newArticle.title,
                icon: '/favicon.ico',
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  // Auto-generate news every 20 seconds
  useEffect(() => {
    const generateNews = async () => {
      try {
        await supabase.functions.invoke('analyze-news', {
          body: { count: 2 },
        });
      } catch (e) {
        console.error('Error generating news:', e);
      }
    };

    // Generate initial batch if empty
    const initTimer = setTimeout(() => {
      if (articles.length === 0) {
        generateNews();
      }
    }, 2000);

    const interval = setInterval(generateNews, 20000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [articles.length]);

  const requestNotifications = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sentimentOverview: SentimentOverview = (() => {
    const bullish = articles.filter(a => a.sentiment === 'bullish').length;
    const bearish = articles.filter(a => a.sentiment === 'bearish').length;
    const neutral = articles.filter(a => a.sentiment === 'neutral').length;
    const total = articles.length || 1;
    const avgImpact = articles.length ? Math.round(articles.reduce((s, a) => s + a.impactScore, 0) / articles.length) : 0;
    const highImpact = articles.filter(a => a.impactScore >= 80).length;
    return {
      bullishCount: bullish,
      bearishCount: bearish,
      neutralCount: neutral,
      bullishPercentage: Math.round((bullish / total) * 100),
      bearishPercentage: Math.round((bearish / total) * 100),
      avgImpactScore: avgImpact,
      highImpactCount: highImpact,
    };
  })();

  const dismissAlert = useCallback(() => setShowAlert(false), []);

  return { articles, latestAlert, showAlert, sentimentOverview, requestNotifications, dismissAlert, isLoading };
}
