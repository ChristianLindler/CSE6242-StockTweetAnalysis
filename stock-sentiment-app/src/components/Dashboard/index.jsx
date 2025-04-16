import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import Papa from 'papaparse';

import StockPriceChart from './StockPriceChart';
import SentimentDistributionChart from './SentimentDistributionChart';
import PostVolumeChart from './PostVolumeChart';

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [tickers, setTickers] = useState([]);
  const [ticker, setTicker] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    bullish: '#4CAF50',
    bearish: '#F44336',
    neutral: '#9E9E9E',
    price: '#3F51B5',
    volume: '#FF9800'
  };

  useEffect(() => {
    const fetchCsv = async (url, parser) => {
      const res = await fetch(url);
      const text = await res.text();
      return new Promise((resolve, reject) =>
        Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true,
          complete: r => resolve(r.data),
          error: e => reject(e)
        })
      );
    };

    (async () => {
      try {
        setLoading(true);
        const [stocksRaw, sentimentRaw] = await Promise.all([
          fetchCsv('./filtered_company_values.csv'),
          fetchCsv('./processed_tweets.csv')
        ]);

        // parse dates
        const stocks = stocksRaw.map(r => ({ ...r, date: new Date(r.day_date) }));
        const sentiment = sentimentRaw.map(r => ({ ...r, date: new Date(r.post_date) }));

        setStockData(stocks);
        setSentimentData(sentiment);

        const unique = Array.from(new Set(stocks.map(r => r.ticker_symbol)));
        setTickers(unique);
        setTicker(unique[0] || '');

        // default date range
        const dates = stocks.map(r => r.date.getTime());
        const min = new Date(Math.min(...dates));
        const max = new Date(Math.max(...dates));
        const iso = d => d.toISOString().split('T')[0];
        setStartDate(iso(min));
        setEndDate(iso(max));
      } catch (e) {
        console.error(e);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Typography align="center">Loading…</Typography>;
  if (error)   return <Typography color="error" align="center">{error}</Typography>;

  // apply filters
  const filterBy = arr =>
    arr.filter(r => {
      const iso = r.date.toISOString().split('T')[0];
      return r.ticker_symbol === ticker && iso >= startDate && iso <= endDate;
    });

  const filteredStocks    = filterBy(stockData);
  const filteredSentiment = filterBy(sentimentData);

  return (
    <Grid container spacing={2}>
      {/* ─── TOP ROW ─── */}
      <Grid size={4}>
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="ticker-label">Ticker</InputLabel>
            <Select
              labelId="ticker-label"
              value={ticker}
              label="Ticker"
              onChange={e => setTicker(e.target.value)}
            >
              {tickers.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            fullWidth
            sx={{ mb: 2 }}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />

          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </Paper>
      </Grid>

      <Grid size={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Stock Price
          </Typography>
          <StockPriceChart rawData={filteredStocks} colors={colors} />
        </Paper>
      </Grid>

      {/* ─── BOTTOM ROW ─── */}
      <Grid size={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Sentiment Distribution
          </Typography>
          <SentimentDistributionChart rawData={filteredSentiment} colors={colors} />
        </Paper>
      </Grid>

      <Grid size={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Social Media Post Volume
          </Typography>
          <PostVolumeChart rawData={filteredSentiment} colors={colors} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
