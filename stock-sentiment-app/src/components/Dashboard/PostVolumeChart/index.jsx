import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from 'recharts';
import _ from 'lodash';

const PostVolumeChart = ({ rawData, colors }) => {
  // Aggregate sentiment posts by day.
  const aggregatedData = _.chain(rawData)
    .groupBy(item => item.date.toLocaleDateString())
    .map((group, date) => ({
      date,
      totalPosts: group.length
    }))
    .value();

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={aggregatedData}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis />
          <Tooltip formatter={(value) => [value, 'Posts']} />
          <Legend />
          <Bar 
            dataKey="totalPosts" 
            fill={colors.volume}
            name="Number of Posts"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PostVolumeChart;
