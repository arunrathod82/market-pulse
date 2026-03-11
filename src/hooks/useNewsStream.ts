import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle, SentimentOverview } from '@/types/news';
import { generateInitialNews, generateNewArticle } from '@/data/mockNews';

export function useNewsStream(refreshInterval = 15000) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [latestAlert, setLatestAlert] = useState<NewsArticle | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    setArticles(generateInitialNews());
  }, []);

  const addArticle = useCallback(() => {
    const newArticle = generateNewArticle();
    setArticles(prev => [newArticle, ...prev].slice(0, 50));

    if (newArticle.isBreaking || Math.abs(newArticle.sentimentScore) > 0.7) {
      setLatestAlert(newArticle);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 8000);

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const icon = newArticle.sentiment === 'bullish' ? '📈' : newArticle.sentiment === 'bearish' ? '📉' : '📊';
        new Notification(`${icon} ${newArticle.sentiment === 'bullish' ? 'Bullish' : newArticle.sentiment === 'bearish' ? 'Bearish' : 'Market'} Alert`, {
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
    return {
      bullishCount: bullish,
      bearishCount: bearish,
      neutralCount: neutral,
      bullishPercentage: Math.round((bullish / total) * 100),
      bearishPercentage: Math.round((bearish / total) * 100),
    };
  })();

  const dismissAlert = useCallback(() => setShowAlert(false), []);

  return { articles, latestAlert, showAlert, sentimentOverview, requestNotifications, dismissAlert };
}
