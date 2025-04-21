# DESCRIPTION
This package delivers an interactive React dashboard that us explore how public Twitter sentiment relates to stock price movements. We fuse two large datasets— Values of Top NASDAQ Companies (2010–2020) and Tweets about the Top Companies from 2015 to 2020 classified via FinBERT into bullish (+1), neutral (0), or bearish (–1) into a suite of views:

Weekly Sentiment × Price Change: A dual‑axis line chart plotting your custom weekly sentiment index against percent price change, with on‑hover tooltips and a computed Pearson correlation coefficient.

Sentiment Distribution: Pie and bar charts that show how often users express bullish vs. bearish views.

Price Time‑Series: A clean line plot of closing prices over any user‑selected date range, giving pure market context alongside sentiment trends.

Under the hood, we:

- GPU‑Accelerate FinBERT to label hundreds of thousands of tweets, capturing domain‑specific tone shifts often missed by simpler lexicon approaches.
- Compute a weekly sentiment index, grouping tweets by the Monday of their week, then averaging sentiment scores to create an intuitive “optimism” gauge.
- Provide fully interactive filters (ticker selection + date‑range pickers) so all charts update in real time without page reloads.

This dashboard makes it easier to spot periods (earnings weeks, market crashes, industry events) where social‐media sentiment may amplify —or lag— market moves, and to drill into the data with responsive, synchronized visualizations.

The live demo is hosted at:
https://christianlindler.github.io/CSE6242-StockTweetAnalysis/

The git repository is at:
https://github.com/ChristianLindler/CSE6242-StockTweetAnalysis/

# INSTALLATION
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

# EXECUTION
1. Start the development server:
   npm run dev
2. Open your browser to http://localhost:3000 (or the port Vite reports) to view the dashboard.
3. Interact with the stock selector and date pickers to see sentiment vs. price‐change charts.
