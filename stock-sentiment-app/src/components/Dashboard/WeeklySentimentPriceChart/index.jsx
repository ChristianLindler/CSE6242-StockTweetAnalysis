import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from 'recharts';
import _ from 'lodash';
import { Typography } from '@mui/material';

const WeeklySentimentPriceChart = ({ sentimentData, stockData }) => {
  const SCALE = 10;
  const valueMap = { bullish: 1, neutral: 0, bearish: -1 };

  // Helper to get Monday of the week (YYYY‑MM‑DD)
  const weekKey = dateStr => {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  // 1) Weekly sentiment averages (scaled)
  const sentimentWeeks = _(sentimentData)
    .groupBy(d => weekKey(d.date))
    .map((tweets, week) => ({
      week,
      score: _.mean(tweets.map(t => (valueMap[t.sentiment_category] || 0) * SCALE))
    }))
    .value();

  // 2) Weekly price changes (%)
  const stockWeeks = _(stockData)
    .sortBy(d => new Date(d.date))
    .groupBy(d => weekKey(d.date))
    .map((days, week) => {
      const sorted = _.sortBy(days, d => new Date(d.date));
      const first  = sorted[0].close_value;
      const last   = sorted[sorted.length - 1].close_value;
      return { week, priceChange: ((last - first) / first) * 100 };
    })
    .value();

  // 3) Merge into a map by week
  const merged = {};
  sentimentWeeks.forEach(w => {
    merged[w.week] = { week: w.week, score: w.score };
  });
  stockWeeks.forEach(w => {
    if (merged[w.week]) merged[w.week].priceChange = w.priceChange;
    else merged[w.week] = { week: w.week, score: null, priceChange: w.priceChange };
  });

  // 4) Convert to sorted array
  const data = Object.values(merged).sort(
    (a, b) => new Date(a.week) - new Date(b.week)
  );

  // 5) Compute Pearson correlation
  const valid = data.filter(d => d.score != null && d.priceChange != null);
  let correlation = null;
  if (valid.length > 1) {
    const xs = valid.map(d => d.score);
    const ys = valid.map(d => d.priceChange);
    const n  = xs.length;
    const meanX = _.sum(xs) / n;
    const meanY = _.sum(ys) / n;

    let num = 0, denX = 0, denY = 0;
    for (let i = 0; i < n; i++) {
      const dx = xs[i] - meanX;
      const dy = ys[i] - meanY;
      num  += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }
    correlation = num / Math.sqrt(denX * denY);
  }

  // Colors
  const sentimentColor = '#4CAF50';
  const priceColor     = '#FF9800';

  return (
    <div>
      {correlation != null && (
        <Typography variant="subtitle1" align="center" gutterBottom>
          Weekly Sentiment × Price Change Correlation: {correlation.toFixed(2)}
        </Typography>
      )}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" angle={-45} textAnchor="end" height={60} />
            <YAxis
              yAxisId="left"
              domain={[-SCALE, SCALE]}
              tickFormatter={v => (v / SCALE).toFixed(1)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={v => `${v.toFixed(1)}%`}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'Avg Sentiment') {
                  return [(value / SCALE).toFixed(2), 'Avg Sentiment'];
                } else {
                  return [`${value.toFixed(2)}%`, 'Price Change'];
                }
              }}
            />
            <Legend verticalAlign="top" />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="score"
              stroke={sentimentColor}
              strokeWidth={2}
              dot={false}
              name="Avg Sentiment"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="priceChange"
              stroke={priceColor}
              strokeWidth={2}
              dot={false}
              name="Weekly % Change"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklySentimentPriceChart;
