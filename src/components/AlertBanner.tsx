import { NewsArticle } from '@/types/news';
import { X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface AlertBannerProps {
  article: NewsArticle | null;
  show: boolean;
  onDismiss: () => void;
}

const AlertBanner = ({ article, show, onDismiss }: AlertBannerProps) => {
  if (!show || !article) return null;

  const isBullish = article.sentiment === 'bullish';
  const isBearish = article.sentiment === 'bearish';

  return (
    <div
      className={`animate-slide-in border-b transition-all ${
        isBullish
          ? 'bg-[hsl(var(--bullish)/0.1)] border-[hsl(var(--bullish)/0.3)]'
          : isBearish
          ? 'bg-[hsl(var(--bearish)/0.1)] border-[hsl(var(--bearish)/0.3)]'
          : 'bg-[hsl(var(--breaking)/0.1)] border-[hsl(var(--breaking)/0.3)]'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 p-1.5 rounded-md ${
            isBullish ? 'bg-[hsl(var(--bullish)/0.2)]' : isBearish ? 'bg-[hsl(var(--bearish)/0.2)]' : 'bg-[hsl(var(--breaking)/0.2)]'
          }`}>
            {isBullish ? (
              <TrendingUp className="h-4 w-4 text-bullish" />
            ) : isBearish ? (
              <TrendingDown className="h-4 w-4 text-bearish" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-breaking" />
            )}
          </div>
          <div className="min-w-0">
            <span className={`text-xs font-bold font-mono uppercase tracking-wider ${
              isBullish ? 'text-bullish' : isBearish ? 'text-bearish' : 'text-breaking'
            }`}>
              {isBullish ? '📈 Bullish Alert' : isBearish ? '📉 Bearish Alert' : '⚡ Breaking News'}
            </span>
            <p className="text-sm text-foreground truncate">{article.title}</p>
          </div>
        </div>
        <button onClick={onDismiss} className="flex-shrink-0 p-1 rounded-md hover:bg-secondary transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;
