import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle, SentimentOverview } from '@/types/news';
import { generateInitialNews, generateNewArticle } from '@/data/mockNews';

const MIN_IMPACT_SCORE = 60;

export function useNewsStream(refreshInterval = 15000) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [latestAlert, setLatestAlert] = useState<NewsArticle | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Only show high-impact articles (score >= 60)
    const initial = generateInitialNews().filter(a => a.impactScore >= MIN_IMPACT_SCORE);
    setArticles(initial);
  }, []);

  const addArticle = useCallback(() => {
    const newArticle = generateNewArticle();
    // Filter: only keep articles with impact score >= 60
    if (newArticle.impactScore < MIN_IMPACT_SCORE) return;

    setArticles(prev => [newArticle, ...prev].slice(0, 50));

    if (newArticle.isBreaking || newArticle.impactScore >= 80) {
      setLatestAlert(newArticle);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 8000);

      if ('Notification' in window && Notification.permission === 'granted') {
        const icon = newArticle.sentiment === 'bullish' ? '📈' : newArticle.sentiment === 'bearish' ? '📉' : '📊';
        new Notification(`${icon} Impact ${newArticle.impactScore} — ${newArticle.sentiment === 'bullish' ? 'Bullish' : newArticle.sentiment === 'bearish' ? 'Bearish' : 'Market'} Alert`, {
          body: newArticle.title,
          icon: '/favicon.ico',
        });
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(addArticle, refreshInterval);
    return () => clearInterval(interval);
  }, [addArticle, refreshInterval]);

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

  return { articles, latestAlert, showAlert, sentimentOverview, requestNotifications, dismissAlert };
}
