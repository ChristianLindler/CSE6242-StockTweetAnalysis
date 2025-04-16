import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import _ from 'lodash';

const SentimentDistributionChart = ({ rawData, colors }) => {
  // Compute sentiment distribution from the raw sentiment data.
  const data = _.chain(rawData)
    .countBy('sentiment_category')
    .map((count, category) => ({
      category,
      count,
      color: colors[category] || '#8884d8'
    }))
    .value();

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Posts']} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentDistributionChart;
