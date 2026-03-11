import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simulated high-quality financial news headlines for demo
const newsTemplates = [
  {
    title: "Nvidia Reports Record Q4 Revenue of $22.1B, Beating Estimates by 20%",
    summary: "Nvidia's data center revenue surged 409% year-over-year driven by massive AI chip demand from hyperscalers and enterprise customers.",
    tickers: ["NVDA"], companies: ["Nvidia"], sectors: ["Semiconductor", "AI"],
    sentiment: "bullish", sentimentScore: 0.92, impactScore: 95,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["earnings", "ai_breakthrough"],
    source: "Reuters"
  },
  {
    title: "Federal Reserve Holds Interest Rates Steady, Signals Possible Cut in Q3",
    summary: "The Federal Reserve maintained the federal funds rate at 5.25-5.50% but indicated potential rate cuts later this year if inflation continues to moderate.",
    tickers: ["SPY", "QQQ"], companies: ["Federal Reserve"], sectors: ["Banking", "Financial Services"],
    sentiment: "bullish", sentimentScore: 0.65, impactScore: 88,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["interest_rate"],
    source: "Bloomberg"
  },
  {
    title: "Tesla Faces Major Production Halt at Shanghai Gigafactory",
    summary: "Tesla's Shanghai facility has suspended production for two weeks due to supply chain disruptions affecting battery components from key suppliers.",
    tickers: ["TSLA"], companies: ["Tesla"], sectors: ["Automotive", "EV"],
    sentiment: "bearish", sentimentScore: -0.78, impactScore: 82,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["disruption"],
    source: "CNBC"
  },
  {
    title: "Microsoft Announces $10B Investment in OpenAI for Enterprise AI Products",
    summary: "Microsoft deepens its partnership with OpenAI, committing $10 billion to develop enterprise-grade AI solutions integrated across Azure and Office 365.",
    tickers: ["MSFT"], companies: ["Microsoft", "OpenAI"], sectors: ["Technology", "AI"],
    sentiment: "bullish", sentimentScore: 0.85, impactScore: 87,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["partnership", "ai_breakthrough", "large_contract"],
    source: "Financial Times"
  },
  {
    title: "Apple Faces EU Antitrust Fine of €1.8 Billion Over App Store Practices",
    summary: "The European Commission has fined Apple €1.8 billion for anti-competitive behavior in its App Store, potentially forcing changes to its 30% commission model.",
    tickers: ["AAPL"], companies: ["Apple"], sectors: ["Technology"],
    sentiment: "bearish", sentimentScore: -0.72, impactScore: 79,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["regulation", "lawsuit"],
    source: "Wall Street Journal"
  },
  {
    title: "AMD Secures $3.5B Contract to Supply AI Chips to Major Cloud Provider",
    summary: "Advanced Micro Devices wins a multi-year deal to supply its MI300X AI accelerators to one of the top three cloud computing providers.",
    tickers: ["AMD"], companies: ["AMD"], sectors: ["Semiconductor", "AI"],
    sentiment: "bullish", sentimentScore: 0.81, impactScore: 83,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["large_contract", "ai_breakthrough"],
    source: "Reuters"
  },
  {
    title: "JPMorgan Chase Reports Record Trading Revenue Amid Market Volatility",
    summary: "JPMorgan's fixed income and equity trading desks generated $8.2 billion in revenue, a 25% increase driven by heightened market volatility.",
    tickers: ["JPM"], companies: ["JPMorgan Chase"], sectors: ["Banking"],
    sentiment: "bullish", sentimentScore: 0.74, impactScore: 76,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["earnings"],
    source: "Bloomberg"
  },
  {
    title: "Reliance Industries Completes $5B Acquisition of European Renewable Energy Firm",
    summary: "Reliance Industries finalizes the acquisition of a major European solar and wind energy company, expanding its green energy portfolio significantly.",
    tickers: ["RELIANCE"], companies: ["Reliance Industries"], sectors: ["Energy", "Renewables"],
    sentiment: "bullish", sentimentScore: 0.70, impactScore: 78,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["merger_acquisition"],
    source: "Economic Times"
  },
  {
    title: "Intel Warns of Weaker Than Expected Q2 Guidance, Shares Drop 8%",
    summary: "Intel issued disappointing Q2 revenue guidance of $12.5B-$13.5B, well below analyst expectations, citing weak PC demand and competitive pressures in data center.",
    tickers: ["INTC"], companies: ["Intel"], sectors: ["Semiconductor"],
    sentiment: "bearish", sentimentScore: -0.85, impactScore: 80,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["earnings"],
    source: "MarketWatch"
  },
  {
    title: "Google DeepMind Achieves Major Breakthrough in Protein Structure Prediction",
    summary: "Alphabet's DeepMind division announces AlphaFold 3, capable of predicting protein-drug interactions with 95% accuracy, opening massive pharmaceutical applications.",
    tickers: ["GOOGL"], companies: ["Alphabet", "Google DeepMind"], sectors: ["Technology", "AI", "Pharma"],
    sentiment: "bullish", sentimentScore: 0.88, impactScore: 84,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["ai_breakthrough"],
    source: "Nature"
  },
  {
    title: "Amazon Web Services Revenue Grows 37% as Enterprise AI Workloads Surge",
    summary: "AWS reported $25.8B in quarterly revenue, accelerating growth as enterprises migrate AI training and inference workloads to the cloud platform.",
    tickers: ["AMZN"], companies: ["Amazon"], sectors: ["Technology", "Cloud Computing"],
    sentiment: "bullish", sentimentScore: 0.79, impactScore: 81,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["earnings"],
    source: "CNBC"
  },
  {
    title: "TCS Wins $2B Digital Transformation Contract from European Bank",
    summary: "Tata Consultancy Services secures a landmark 10-year deal with a top-5 European bank for complete digital infrastructure modernization.",
    tickers: ["TCS"], companies: ["TCS"], sectors: ["IT Services"],
    sentiment: "bullish", sentimentScore: 0.72, impactScore: 75,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["large_contract"],
    source: "Economic Times"
  },
  {
    title: "Meta Platforms Under Investigation by FTC for AI Data Collection Practices",
    summary: "The Federal Trade Commission launches a formal investigation into Meta's use of user data for training AI models without explicit consent.",
    tickers: ["META"], companies: ["Meta Platforms"], sectors: ["Technology", "Social Media"],
    sentiment: "bearish", sentimentScore: -0.68, impactScore: 77,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["regulation", "lawsuit"],
    source: "Wall Street Journal"
  },
  {
    title: "Goldman Sachs Predicts S&P 500 to Reach 5,500 by Year-End",
    summary: "Goldman Sachs raises its S&P 500 year-end target to 5,500, citing strong corporate earnings growth, moderating inflation, and expected Fed rate cuts.",
    tickers: ["GS", "SPY"], companies: ["Goldman Sachs"], sectors: ["Banking", "Market Analysis"],
    sentiment: "bullish", sentimentScore: 0.62, impactScore: 72,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["market_crash_rally"],
    source: "Bloomberg"
  },
  {
    title: "Boeing 737 MAX Faces New Safety Concerns After Mid-Air Incident",
    summary: "The FAA orders inspections of all Boeing 737 MAX 9 aircraft after a door plug blew out during an Alaska Airlines flight, raising fresh safety questions.",
    tickers: ["BA"], companies: ["Boeing"], sectors: ["Aerospace"],
    sentiment: "bearish", sentimentScore: -0.88, impactScore: 85,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["disruption", "regulation"],
    source: "Reuters"
  },
  {
    title: "Netflix Adds Record 13M Subscribers in Q4 After Password Sharing Crackdown",
    summary: "Netflix exceeded expectations with 13.1 million new subscribers in Q4, the largest quarterly gain in four years, driven by its password-sharing enforcement.",
    tickers: ["NFLX"], companies: ["Netflix"], sectors: ["Entertainment", "Streaming"],
    sentiment: "bullish", sentimentScore: 0.82, impactScore: 78,
    marketRelevance: "high", isBreaking: false,
    tradingEvents: ["earnings"],
    source: "Variety"
  },
  {
    title: "Exxon Mobil to Acquire Pioneer Natural Resources for $59.5 Billion",
    summary: "ExxonMobil announces the largest oil and gas deal in over two decades, acquiring Pioneer Natural Resources to become the dominant player in the Permian Basin.",
    tickers: ["XOM"], companies: ["Exxon Mobil", "Pioneer Natural Resources"], sectors: ["Energy", "Oil & Gas"],
    sentiment: "bullish", sentimentScore: 0.71, impactScore: 86,
    marketRelevance: "high", isBreaking: true,
    tradingEvents: ["merger_acquisition"],
    source: "Financial Times"
  },
  {
    title: "Infosys Faces Client Attrition as AI Automation Reduces Outsourcing Demand",
    summary: "Infosys reports declining deal sizes as major clients increasingly adopt AI automation tools, reducing reliance on traditional IT outsourcing services.",
    tickers: ["INFY"], companies: ["Infosys"], sectors: ["IT Services"],
    sentiment: "bearish", sentimentScore: -0.65, impactScore: 71,
    marketRelevance: "medium", isBreaking: false,
    tradingEvents: ["disruption"],
    source: "Mint"
  },
  {
    title: "Visa Reports Strong Cross-Border Payment Volumes, Travel Spending Surges",
    summary: "Visa's cross-border payment volumes grew 16% year-over-year as international travel spending continues its strong post-pandemic recovery.",
    tickers: ["V"], companies: ["Visa"], sectors: ["Financial Services", "Payments"],
    sentiment: "bullish", sentimentScore: 0.68, impactScore: 70,
    marketRelevance: "medium", isBreaking: false,
    tradingEvents: ["earnings"],
    source: "Barron's"
  },
  {
    title: "Walmart Expands AI-Powered Supply Chain, Expects $1B Annual Savings",
    summary: "Walmart deploys generative AI across its logistics network, projecting over $1 billion in annual cost savings through optimized inventory management and routing.",
    tickers: ["WMT"], companies: ["Walmart"], sectors: ["Retail", "AI"],
    sentiment: "bullish", sentimentScore: 0.73, impactScore: 74,
    marketRelevance: "medium", isBreaking: false,
    tradingEvents: ["ai_breakthrough", "partnership"],
    source: "CNBC"
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { count } = req.method === "POST" ? await req.json() : { count: 3 };
    const articlesToInsert = Math.min(count || 3, 5);

    const inserted: any[] = [];

    for (let i = 0; i < articlesToInsert; i++) {
      const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];

      // Add slight time variation
      const publishedAt = new Date(Date.now() - Math.random() * 300000).toISOString();

      const article = {
        title: template.title,
        summary: template.summary,
        source: template.source,
        published_at: publishedAt,
        url: `https://example.com/news/${Date.now()}`,
        sentiment: template.sentiment,
        sentiment_score: template.sentimentScore,
        impact_score: template.impactScore,
        market_relevance: template.marketRelevance,
        is_breaking: template.isBreaking,
        tickers: template.tickers,
        companies: template.companies,
        sectors: template.sectors,
        trading_events: template.tradingEvents,
      };

      const { data, error } = await supabase
        .from("articles")
        .insert(article)
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        continue;
      }

      inserted.push(data);

      // Create alert for high-impact articles
      if (data.impact_score >= 70) {
        const alertType = data.is_breaking
          ? "breaking"
          : data.sentiment === "bullish"
          ? "bullish_signal"
          : data.sentiment === "bearish"
          ? "bearish_signal"
          : "high_impact";

        await supabase.from("alerts").insert({
          article_id: data.id,
          company_symbol: data.tickers[0] || null,
          alert_type: alertType,
          impact_score: data.impact_score,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, inserted: inserted.length, articles: inserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-news error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
