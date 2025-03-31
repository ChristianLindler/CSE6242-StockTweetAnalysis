1. **Download data**
2. **Organize data**
   We want to parse the csvs so we have a dictionary w the structure
   Also it is important for us to decide how we will let users query. Will they always have exactly one stock selected? If so stock should be the first index
   {date/window: [stock: pct_return, tweets]}
   (we should settle on window size now)

3. **Generate features**
   Then for every stock we need:
   RoBERta/finBERT embedding (maybe use PCA to reduce to two dimensions)
   A 0-1 sentiment score
   A classification of bullish/bearish/neutral (pretrained/fine tuned model?)

4. **Analysis**
   A pie chart of bullish/bearish/neutral would be very easy.
   We could also do the overlay of sentiment score with stock price change (also just toss a normal stock graph somewhere to squeeze out an extra graph)
   We’re gonna want to display the correlation here too.Now what do we do w the PCA to two dimensions? I couldn’t tell ya. Average embedding to weekly price change model?

5. **Visualization**
   I'd like to do React.JS for this. It is really easy and we could use D3 if y'all feel comfortable
# Stock Market Sentiment Analysis Dashboard

A React-based dashboard that visualizes stock market prices alongside sentiment analysis data from social media.

## Overview

This application combines stock price historical data with BERT-generated sentiment analysis from social media posts to help users understand the relationship between public sentiment and stock price movements.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to the local development server

## Building for Production

```
npm run build
```
