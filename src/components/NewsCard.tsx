import { NewsArticle } from '@/types/news';
import { TrendingUp, TrendingDown, Minus, Clock, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  article: NewsArticle;
  isNew?: boolean;
}

const NewsCard = ({ article, isNew }: NewsCardProps) => {
  const isBullish = article.sentiment === 'bullish';
  const isBearish = article.sentiment === 'bearish';

  return (
    <article
      className={`group rounded-lg border p-4 transition-all hover:border-muted-foreground/30 ${
        isNew ? 'animate-slide-in' : ''
      } ${
        article.isBreaking
          ? 'border-[hsl(var(--breaking)/0.4)] bg-[hsl(var(--breaking)/0.03)]'
          : 'border-border bg-card'
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {article.isBreaking && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[hsl(var(--breaking)/0.15)] text-breaking">
              <Zap className="h-3 w-3" /> Breaking
            </span>
          )}
          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
            isBullish
              ? 'bg-[hsl(var(--bullish)/0.15)] text-bullish'
              : isBearish
              ? 'bg-[hsl(var(--bearish)/0.15)] text-bearish'
              : 'bg-secondary text-neutral'
          }`}>
            {isBullish ? <TrendingUp className="h-3 w-3" /> : isBearish ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {isBullish ? 'Bullish' : isBearish ? 'Bearish' : 'Neutral'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(article.timestamp, { addSuffix: true })}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug">
        {article.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
        {article.summary}
      </p>

      {/* Tickers & metadata */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {article.tickers.map(t => (
            <span key={t} className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[hsl(var(--ticker)/0.1)] text-ticker">
              {t}
            </span>
          ))}
          {article.sectors.map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-secondary text-secondary-foreground">
              {s}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground">{article.source}</span>
      </div>

      {/* Sentiment bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBullish ? 'bg-bullish' : isBearish ? 'bg-bearish' : 'bg-neutral'
            }`}
            style={{ width: `${Math.abs(article.sentimentScore) * 100}%` }}
          />
        </div>
        <span className={`text-[10px] font-mono font-bold ${
          isBullish ? 'text-bullish' : isBearish ? 'text-bearish' : 'text-neutral'
        }`}>
          {article.sentimentScore > 0 ? '+' : ''}{(article.sentimentScore * 100).toFixed(0)}%
        </span>
      </div>
    </article>
  );
};

export default NewsCard;
