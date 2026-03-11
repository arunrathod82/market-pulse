import { SentimentOverview } from '@/types/news';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentPanelProps {
  overview: SentimentOverview;
}

const SentimentPanel = ({ overview }: SentimentPanelProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Market Sentiment
      </h2>

      {/* Gauge bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-bullish">{overview.bullishPercentage}% Bullish</span>
          <span className="text-bearish">{overview.bearishPercentage}% Bearish</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden flex">
          <div
            className="bg-bullish transition-all duration-700 ease-out rounded-l-full"
            style={{ width: `${overview.bullishPercentage}%` }}
          />
          <div
            className="bg-neutral transition-all duration-700 ease-out"
            style={{ width: `${100 - overview.bullishPercentage - overview.bearishPercentage}%` }}
          />
          <div
            className="bg-bearish transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${overview.bearishPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-md bg-[hsl(var(--bullish)/0.1)] p-3 text-center">
          <TrendingUp className="h-4 w-4 text-bullish mx-auto mb-1" />
          <div className="text-lg font-bold font-mono text-bullish">{overview.bullishCount}</div>
          <div className="text-xs text-muted-foreground">Bullish</div>
        </div>
        <div className="rounded-md bg-secondary p-3 text-center">
          <Minus className="h-4 w-4 text-neutral mx-auto mb-1" />
          <div className="text-lg font-bold font-mono text-neutral">{overview.neutralCount}</div>
          <div className="text-xs text-muted-foreground">Neutral</div>
        </div>
        <div className="rounded-md bg-[hsl(var(--bearish)/0.1)] p-3 text-center">
          <TrendingDown className="h-4 w-4 text-bearish mx-auto mb-1" />
          <div className="text-lg font-bold font-mono text-bearish">{overview.bearishCount}</div>
          <div className="text-xs text-muted-foreground">Bearish</div>
        </div>
      </div>
    </div>
  );
};

export default SentimentPanel;
