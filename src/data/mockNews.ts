import { NewsArticle, Sentiment } from '@/types/news';

const headlines: { title: string; summary: string; sentiment: Sentiment; score: number; tickers: string[]; sectors: string[]; isBreaking: boolean }[] = [
  { title: "Tesla Signs Major EV Deal with European Fleet Operators", summary: "Tesla has secured a $4.2B deal to supply electric vehicles to major European fleet management companies, marking the largest single EV order in history. Analysts expect this to boost Q3 earnings significantly.", sentiment: 'bullish', score: 0.85, tickers: ['TSLA'], sectors: ['EV', 'AUTO'], isBreaking: true },
  { title: "Government Increases Taxes on IT Sector – Markets React", summary: "The government announced a 5% increase in corporate tax for IT companies effective next quarter. TCS, Infosys, and Wipro shares dropped 3-4% in early trading.", sentiment: 'bearish', score: -0.78, tickers: ['TCS', 'INFY', 'WIPRO'], sectors: ['IT SECTOR'], isBreaking: true },
  { title: "Reliance Industries Reports Record Quarterly Revenue", summary: "Reliance Industries posted a 22% YoY revenue growth driven by strong performance in Jio Platforms and retail segments. EBITDA margins improved to 18.4%.", sentiment: 'bullish', score: 0.72, tickers: ['RELIANCE'], sectors: ['CONGLOMERATE'], isBreaking: false },
  { title: "Federal Reserve Signals Potential Rate Cut in Next Meeting", summary: "Fed Chair's dovish comments suggest a 25bps rate cut could come as early as the next FOMC meeting, boosting equity futures across the board.", sentiment: 'bullish', score: 0.91, tickers: ['SPY', 'QQQ'], sectors: ['BANKING', 'NIFTY'], isBreaking: true },
  { title: "HDFC Bank Merger Integration Progresses Ahead of Schedule", summary: "HDFC Bank announced that the merger integration with HDFC Ltd is progressing faster than expected, with cost synergies already visible in Q2 results.", sentiment: 'bullish', score: 0.65, tickers: ['HDFCBANK'], sectors: ['BANKING'], isBreaking: false },
  { title: "Crude Oil Prices Surge Amid Middle East Tensions", summary: "Brent crude jumped 6% to $94/barrel as geopolitical tensions escalate. Analysts warn of potential supply disruptions affecting global markets.", sentiment: 'bearish', score: -0.82, tickers: ['ONGC', 'IOC'], sectors: ['OIL & GAS', 'ENERGY'], isBreaking: true },
  { title: "Apple Unveils AI-Powered Features for iPhone 17 Series", summary: "Apple's latest announcement includes on-device AI capabilities that analysts say could drive a major upgrade cycle. Revenue estimates revised upward.", sentiment: 'bullish', score: 0.68, tickers: ['AAPL'], sectors: ['TECH'], isBreaking: false },
  { title: "NIFTY 50 Hits All-Time High Above 24,000 Mark", summary: "Indian benchmark index NIFTY 50 crossed the historic 24,000 level driven by broad-based buying across sectors. FII inflows remain strong.", sentiment: 'bullish', score: 0.75, tickers: ['NIFTY'], sectors: ['NIFTY'], isBreaking: true },
  { title: "Infosys Faces Large Client Attrition in North America", summary: "Infosys reportedly lost two major accounts in North America worth $300M annually. Management cited pricing pressures and delayed deal closures.", sentiment: 'bearish', score: -0.7, tickers: ['INFY'], sectors: ['IT SECTOR'], isBreaking: false },
  { title: "BankNifty Drops 500 Points on NPA Concerns", summary: "Banking index BankNifty fell sharply after reports of rising non-performing assets across mid-tier banks. PSU banks were the worst hit.", sentiment: 'bearish', score: -0.88, tickers: ['BANKNIFTY', 'SBIN', 'PNB'], sectors: ['BANKING'], isBreaking: true },
  { title: "Wipro Wins $1B Cloud Transformation Deal", summary: "Wipro secured a multi-year cloud transformation deal with a Fortune 100 company, its largest ever. The deal is expected to boost order book visibility.", sentiment: 'bullish', score: 0.6, tickers: ['WIPRO'], sectors: ['IT SECTOR'], isBreaking: false },
  { title: "Tata Motors EV Sales Surge 45% in Q3", summary: "Tata Motors reported a 45% increase in EV sales for Q3, driven by strong demand for the Nexon EV and Tiago EV models across tier-2 cities.", sentiment: 'bullish', score: 0.7, tickers: ['TATAMOTORS'], sectors: ['AUTO', 'EV'], isBreaking: false },
  { title: "Pharma Sector Faces FDA Warning Letters", summary: "Three major Indian pharma companies received FDA warning letters for manufacturing quality issues, triggering a sector-wide sell-off.", sentiment: 'bearish', score: -0.65, tickers: ['SUNPHARMA', 'DRREDDY'], sectors: ['PHARMA'], isBreaking: false },
  { title: "Gold Prices Hit Record $2,500/oz Amid Global Uncertainty", summary: "Gold surged to a record high as investors seek safe-haven assets amid rising geopolitical tensions and currency volatility.", sentiment: 'neutral', score: 0.1, tickers: ['GOLD'], sectors: ['COMMODITIES'], isBreaking: false },
  { title: "Adani Group Announces $10B Green Energy Investment", summary: "Adani Green Energy announced a massive $10B investment plan for solar and wind energy projects over the next 5 years.", sentiment: 'bullish', score: 0.58, tickers: ['ADANIGREEN', 'ADANIENT'], sectors: ['ENERGY', 'GREEN ENERGY'], isBreaking: false },
  { title: "RBI Holds Interest Rates Steady as Expected", summary: "The Reserve Bank of India kept the repo rate unchanged at 6.5% for the sixth consecutive meeting, citing persistent inflation concerns.", sentiment: 'neutral', score: 0.05, tickers: ['BANKNIFTY'], sectors: ['BANKING'], isBreaking: false },
  { title: "Meta Platforms Revenue Misses Wall Street Estimates", summary: "Meta reported Q3 revenue of $33.6B, slightly below consensus estimates of $34.1B. Ad revenue growth slowed in Asia-Pacific markets.", sentiment: 'bearish', score: -0.55, tickers: ['META'], sectors: ['TECH'], isBreaking: false },
  { title: "Indian Rupee Weakens to Record Low Against Dollar", summary: "The Indian rupee depreciated to a new all-time low of 84.5 against the US dollar, pressured by strong dollar demand and FII outflows.", sentiment: 'bearish', score: -0.6, tickers: ['NIFTY', 'USDINR'], sectors: ['FOREX', 'BANKING'], isBreaking: false },
];

const sources = ['Bloomberg', 'Reuters', 'CNBC', 'MoneyControl', 'Economic Times', 'Livemint', 'MarketWatch', 'Financial Express'];

let idCounter = 0;

function createArticle(index: number, timeOffset: number = 0): NewsArticle {
  const h = headlines[index % headlines.length];
  idCounter++;
  return {
    id: `news-${idCounter}-${Date.now()}`,
    title: h.title,
    summary: h.summary,
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(Date.now() - timeOffset),
    sentiment: h.sentiment,
    sentimentScore: h.score,
    tickers: h.tickers,
    sectors: h.sectors,
    isBreaking: h.isBreaking,
    url: '#',
  };
}

export function generateInitialNews(): NewsArticle[] {
  return headlines.map((_, i) => createArticle(i, (headlines.length - i) * 120000));
}

export function generateNewArticle(): NewsArticle {
  const idx = Math.floor(Math.random() * headlines.length);
  return createArticle(idx);
}
