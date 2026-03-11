import { NewsArticle, tradingEventLabels } from '@/types/news';
import { TrendingUp, TrendingDown, Zap, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TopImpactNewsProps {
  articles: NewsArticle[];
}

const TopImpactNews = ({ articles }: TopImpactNewsProps) => {
  const topImpact = [...articles]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 5);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Target className="h-4 w-4 text-breaking" /> Top Impact
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
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-mono text-ticker">{article.tickers[0]}</span>
                  {article.tradingEvents.slice(0, 2).map(e => (
                    <span key={e} className="text-[9px] font-mono text-accent">{tradingEventLabels[e]}</span>
                  ))}
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(article.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold flex-shrink-0 px-1.5 py-0.5 rounded ${
                article.impactScore >= 80
                  ? 'bg-[hsl(var(--breaking)/0.15)] text-breaking'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {article.impactScore}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopImpactNews;
