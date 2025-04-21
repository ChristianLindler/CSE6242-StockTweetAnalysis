import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
} from 'recharts';
import _ from 'lodash';
import { Typography } from '@mui/material';

const SentimentPriceScatter = ({
  sentimentData,
  stockData,
  horizon = 1,
  scale   = 10,
}) => {
  const valueMap = { bullish: 1, neutral: 0, bearish: -1 };

  // ── build chart data & regression in one memo ───────────────────────
  const { points, regLine, r } = useMemo(() => {
    // 1) daily avg sentiment
    const dailySent = _(sentimentData)
      .groupBy(d => d.date.toISOString().slice(0, 10))
      .mapValues(rows => _.mean(rows.map(r => valueMap[r.sentiment_category] ?? 0)))
      .value();

    // 2) map of daily closes
    const close = {};
    stockData.forEach(r => {
      close[r.date.toISOString().slice(0, 10)] = r.close_value;
    });

    // 3) scatter points
    const pts = [];
    Object.keys(dailySent).forEach(dStr => {
      const t0 = new Date(dStr);
      const t1 = new Date(t0);
      t1.setDate(t1.getDate() + horizon);
      const k1 = t1.toISOString().slice(0, 10);

      if (close[dStr] != null && close[k1] != null) {
        pts.push({
          x: dailySent[dStr] / scale,
          y: ((close[k1] - close[dStr]) / close[dStr]) * 100,
        });
      }
    });

    // 4) regression + correlation
    let slope = 0, intercept = 0, corr = null;
    if (pts.length > 1) {
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
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
      corr      = num / Math.sqrt(denX * denY);
      slope     = num / denX;
      intercept = meanY - slope * meanX;
    }

    const reg = [
      { x: -.2, y: slope * -1 + intercept },
      { x:  .2, y: slope *  1 + intercept },
    ];

    return { points: pts, regLine: reg, r: corr };
  }, [sentimentData, stockData, horizon, scale]);

  // ── visual tweaks ───────────────────────────────────────────────────
  const sentimentColor = '#4CAF50';
  const lineColor      = '#FF9800';
  const ticksX         = [-0.2, -0.10, 0, 0.10, 0.2];

  return (
    <>
      {r != null && (
        <Typography align="center" variant="subtitle1" gutterBottom>
          {horizon}-day horizon&nbsp;|&nbsp;Pearson r&nbsp;{r.toFixed(2)}
        </Typography>
      )}

      {/* match StockPriceChart height */}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <ScatterChart
            margin={{ top: 40, right: 30, left: 60, bottom: 40 }}  // more left room
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="x"
              type="number"
              domain={[-0.2, 0.2]}
              ticks={ticksX}
              tick={{ fontSize: 12 }}
              tickMargin={8}
            >
              <Label value="Average Sentiment (−1 … 1)"
                     position="bottom"
                     dy={20} />
            </XAxis>

            <YAxis
              dataKey="y"
              type="number"
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={v => `${v.toFixed(0)}%`}
              tick={{ fontSize: 12 }}
              tickMargin={8}
              width={90}                                   // reserve space
            >
              <Label
                value={`% Price change over next ${horizon} day${horizon > 1 ? 's' : ''}`}
                angle={-90}
                position="insideLeft"                      // keep inside plot
                style={{ textAnchor: 'middle', fontSize: 12 }}
              />
            </YAxis>

            <Tooltip
              formatter={(val, name) =>
                name === 'y'
                  ? [`${val.toFixed(2)}%`, '% Change']
                  : [val.toFixed(2), 'Sentiment']
              }
              labelFormatter={() => ''}
            />

            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '24px' }} />

            <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />

            <Scatter
              name="Trading days"
              data={points}
              fill={sentimentColor}
              shape="circle"
              legendType="circle"
              opacity={0.8}
            />

            <Scatter
              name="OLS trend"
              data={regLine}
              line={{ stroke: lineColor, strokeWidth: 2 }}
              legendType="plainline"
              shape={() => null} // hide endpoints
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default SentimentPriceScatter;