import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line
} from 'recharts';

const StockPriceChart = ({ rawData, colors }) => {
  const data = rawData
    .map(item => ({
      ...item,
      formattedDate: item.date.toLocaleDateString()
    }))
    .sort((a, b) => a.date - b.date);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedDate"
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis tickFormatter={v => `$${v}`} />
          <Tooltip formatter={v => [`$${v.toFixed(2)}`, 'Price']} />
          <Line
            type="monotone"
            dataKey="close_value"
            stroke={colors.price}
            strokeWidth={2}
            dot={false}               // <-- no circles on every point
            activeDot={{ r: 6 }}      // slightly larger on hover
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockPriceChart;
