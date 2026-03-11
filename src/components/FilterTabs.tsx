import { Sentiment } from '@/types/news';

interface FilterTabsProps {
  active: 'all' | Sentiment | 'breaking';
  onChange: (tab: 'all' | Sentiment | 'breaking') => void;
}

const tabs: { value: 'all' | Sentiment | 'breaking'; label: string }[] = [
  { value: 'all', label: 'All News' },
  { value: 'breaking', label: '⚡ Breaking' },
  { value: 'bullish', label: '📈 Bullish' },
  { value: 'bearish', label: '📉 Bearish' },
  { value: 'neutral', label: '📊 Neutral' },
];

const FilterTabs = ({ active, onChange }: FilterTabsProps) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
            active === tab.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
