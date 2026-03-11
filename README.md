MarketPulse – Real-Time Market Intelligence 📈

MarketPulse is a real-time stock market news intelligence platform that analyzes financial news and detects bullish and bearish market signals using AI-driven sentiment analysis.

The platform collects financial news, evaluates its market impact, and alerts traders when important events occur.

🚀 Features

📊 Real-time financial news dashboard

🤖 AI-based sentiment analysis (Bullish / Bearish / Neutral)

⚡ Impact score system to detect market-moving news

🚨 Automated alerts for high-impact events

📰 Smart filtering of trading-relevant articles

🌙 Dark trading-terminal UI

🔔 Breaking news detection

📡 Supabase realtime backend

🧠 How It Works

MarketPulse processes financial news using this pipeline:

News APIs
   ↓
AI News Analysis
   ↓
Sentiment Classification
   ↓
Impact Score Calculation
   ↓
Realtime Dashboard + Alerts

Example output:

Stock: NVDA
Sentiment: Bullish
Impact Score: 84

"Nvidia AI demand surges globally"
🛠 Tech Stack

This project is built with:

⚡ Vite

⚛️ React

🧠 TypeScript

🎨 Tailwind CSS

🧩 shadcn-ui

🔥 Supabase (backend & realtime)

📂 Project Structure
market-pulse
│
├── public
│   └── favicon.svg
│
├── src
│   ├── components
│   ├── hooks
│   ├── integrations
│   ├── pages
│   ├── lib
│   └── types
│
├── supabase
│   └── functions
│       └── analyze-news
│
└── index.html
⚙️ Local Development

Make sure you have Node.js installed.

1️⃣ Clone the repository
git clone <YOUR_GIT_URL>
2️⃣ Enter project directory
cd market-pulse
3️⃣ Install dependencies
npm install
4️⃣ Start development server
npm run dev

App will run at:

http://localhost:8080
🔑 Environment Variables

Create a .env file in the root:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
📡 Backend

Backend services are powered by:

Supabase Database

Supabase Edge Functions

Supabase Realtime

News processing logic is implemented in:

supabase/functions/analyze-news
📈 Impact Score Logic

MarketPulse filters news based on impact score:

Score	Action
≥ 60	Show in dashboard
≥ 70	Trigger alert

This helps traders focus only on important market-moving news.

🌐 Deployment

You can deploy the project using:

Vercel

Netlify

Supabase hosting

Lovable publishing

📷 Preview

Example dashboard view:

Bullish News: 62%
Bearish News: 28%
Neutral News: 10%

🧑‍💻 Author

Developed by Arun Rathod

📄 License

This project is licensed under the MIT License.