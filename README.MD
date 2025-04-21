# DESCRIPTION
This package provides a React‑based dashboard that visualizes the relationship between Twitter sentiment and stock price movements for major NASDAQ companies.
Sentiment is extracted from historical tweets (2015–2020) using FinBERT—a BERT variant fine‑tuned on financial text—and mapped to bullish (+1), neutral (0), or bearish (–1).
Stock price data (2010–2020) is combined with weekly averaged sentiment scores to reveal potential correlations.

The live demo is hosted at:
https://christianlindler.github.io/CSE6242-StockTweetAnalysis/

The git repository is at:
https://github.com/ChristianLindler/CSE6242-StockTweetAnalysis/

#INSTALLATION
1. Clone this repository:
   git clone https://github.com/ChristianLindler/CSE6242-StockTweetAnalysis.git
2. Navigate to the web app folder:
   cd CSE6242-StockTweetAnalysis/stock-sentiment-app
3. Fetch or place the preprocessed CSV files into the public folder:
- [filtered_company_values.csv](https://github.com/ChristianLindler/CSE6242-StockTweetAnalysis/blob/main/stock-sentiment-app/public/filtered_company_values.csv)
- [processed_tweets.csv](https://github.com/ChristianLindler/CSE6242-StockTweetAnalysis/blob/main/stock-sentiment-app/public/processed_tweets.csv)
   (These are available in the repo under stock-sentiment-app/public/ or via the links above.)
4. Install dependencies:
   npm install

#EXECUTION
1. Start the development server:
   npm run dev
2. Open your browser to http://localhost:3000 (or the port Vite reports) to view the dashboard.
3. Interact with the stock selector and date pickers to see sentiment vs. price‐change charts.
