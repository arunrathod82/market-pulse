import { useState, useMemo } from 'react';
import { useNewsStream } from '@/hooks/useNewsStream';
import { Sentiment } from '@/types/news';
import Header from '@/components/Header';
import AlertBanner from '@/components/AlertBanner';
import TickerBar from '@/components/TickerBar';
import SentimentPanel from '@/components/SentimentPanel';
import TopImpactNews from '@/components/TopImpactNews';
import NewsCard from '@/components/NewsCard';
import SearchBar from '@/components/SearchBar';
import FilterTabs from '@/components/FilterTabs';

const Index = () => {
  const { articles, latestAlert, showAlert, sentimentOverview, requestNotifications, dismissAlert } = useNewsStream();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Sentiment | 'breaking'>('all');

  const filtered = useMemo(() => {
    let result = articles;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.tickers.some(t => t.toLowerCase().includes(q)) ||
          a.sectors.some(s => s.toLowerCase().includes(q)) ||
          a.source.toLowerCase().includes(q)
      );
    }

    if (filter === 'breaking') {
      result = result.filter(a => a.isBreaking);
    } else if (filter !== 'all') {
      result = result.filter(a => a.sentiment === filter);
    }

    return result;
  }, [articles, search, filter]);

  return (
    <div className="min-h-screen bg-background">
      <Header onEnableNotifications={requestNotifications} />
      <AlertBanner article={latestAlert} show={showAlert} onDismiss={dismissAlert} />
      <TickerBar articles={articles} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <SentimentPanel overview={sentimentOverview} />
            <TopImpactNews articles={articles} />
          </aside>

          {/* Main feed */}
          <section className="lg:col-span-9 space-y-4 order-1 lg:order-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} />
              </div>
            </div>

            <FilterTabs active={filter} onChange={setFilter} />

            <div className="text-xs text-muted-foreground font-mono">
              {filtered.length} articles {search && `matching "${search}"`}
            </div>

            <div className="space-y-3">
              {filtered.map((article, i) => (
                <NewsCard key={article.id} article={article} isNew={i === 0} />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium">No articles found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
