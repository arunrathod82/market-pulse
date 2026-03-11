import { NewsArticle } from '@/types/news';

interface TickerBarProps {
  articles: NewsArticle[];
}

const TickerBar = ({ articles }: TickerBarProps) => {
  const tickerItems = articles
    .filter(a => a.isBreaking || Math.abs(a.sentimentScore) > 0.6)
    .slice(0, 10);

  if (tickerItems.length === 0) return null;

  return (
    <div className="border-b border-border bg-card/50 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold font-mono">
          LIVE
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex whitespace-nowrap gap-8 py-1.5 px-4">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-ticker">{item.tickers[0]}</span>
                <span className={`font-mono ${
                  item.sentiment === 'bullish' ? 'text-bullish' : item.sentiment === 'bearish' ? 'text-bearish' : 'text-neutral'
                }`}>
                  {item.sentiment === 'bullish' ? '▲' : item.sentiment === 'bearish' ? '▼' : '●'}
                </span>
                <span className="text-muted-foreground truncate max-w-[200px]">{item.title}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickerBar;
