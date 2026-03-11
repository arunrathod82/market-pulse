import { NewsArticle } from '@/types/news';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TopImpactNewsProps {
  articles: NewsArticle[];
}

const TopImpactNews = ({ articles }: TopImpactNewsProps) => {
  const topImpact = [...articles]
    .sort((a, b) => Math.abs(b.sentimentScore) - Math.abs(a.sentimentScore))
    .slice(0, 5);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Zap className="h-4 w-4 text-breaking" /> Top Impact
      </h2>
      <div className="space-y-2">
        {topImpact.map(article => {
          const isBullish = article.sentiment === 'bullish';
          const isBearish = article.sentiment === 'bearish';
          return (
            <div
              key={article.id}
              className="flex items-start gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className={`flex-shrink-0 mt-0.5 p-1 rounded ${
                isBullish ? 'bg-[hsl(var(--bullish)/0.15)]' : isBearish ? 'bg-[hsl(var(--bearish)/0.15)]' : 'bg-secondary'
              }`}>
                {isBullish ? (
                  <TrendingUp className="h-3 w-3 text-bullish" />
                ) : isBearish ? (
                  <TrendingDown className="h-3 w-3 text-bearish" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-neutral" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-ticker">{article.tickers[0]}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(article.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold flex-shrink-0 ${
                isBullish ? 'text-bullish' : isBearish ? 'text-bearish' : 'text-neutral'
              }`}>
                {article.sentimentScore > 0 ? '+' : ''}{(article.sentimentScore * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopImpactNews;
