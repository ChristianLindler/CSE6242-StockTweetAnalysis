import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';

const StockSentimentDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [availableTickers, setAvailableTickers] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    bullish: '#4CAF50',
    bearish: '#F44336',
    neutral: '#9E9E9E',
    price: '#3F51B5',
    volume: '#FF9800'
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // load csv files
        const sentimentResponse = await fetch('./processed_tweets.csv');
        const sentimentText = await sentimentResponse.text();
        
        const stockResponse = await fetch('./filtered_company_values.csv');
        const stockText = await stockResponse.text();
        
        Papa.parse(stockText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedStockData = results.data.map(row => ({
              ...row,
              date: new Date(row.day_date),
              formattedDate: new Date(row.day_date).toLocaleDateString()
            }));
            setStockData(processedStockData);
            
            const tickers = [...new Set(processedStockData.map(row => row.ticker_symbol))];
            setAvailableTickers(tickers);
            if (tickers.length > 0) {
              setSelectedTicker(tickers[0]);
            }
          },
          error: (error) => {
            console.error('Error parsing stock data:', error);
            setError('Failed to parse stock data');
          }
        });
        
        Papa.parse(sentimentText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedSentimentData = results.data.map(row => ({
              ...row,
              date: new Date(row.post_date),
              formattedDate: new Date(row.post_date).toLocaleDateString()
            }));
            setSentimentData(processedSentimentData);
          },
          error: (error) => {
            console.error('Error parsing sentiment data:', error);
            setError('Failed to parse sentiment data');
          }
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredStockData = stockData.filter(item => item.ticker_symbol === selectedTicker);
  const filteredSentimentData = sentimentData.filter(item => item.ticker_symbol === selectedTicker);

  const sentimentDistribution = _.chain(filteredSentimentData)
    .countBy('sentiment_category')
    .map((count, category) => ({ 
      category, 
      count,
      color: colors[category] || '#8884d8'
    }))
    .value();

  const aggregatedSentimentByDay = _.chain(filteredSentimentData)
    .groupBy('formattedDate')
    .map((group, date) => ({
      date,
      totalPosts: group.length
    }))
    .value();

  // loading msg
  if (isLoading) {
    return <div className="flex justify-center items-center h-64 w-full">Loading data...</div>;
  }

  // error msg
  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-6 text-center">Stock Market Sentiment Analysis</h1>
      
      <div className="mb-6 flex justify-center">
        <div className="w-64">
          <label htmlFor="ticker" className="block text-sm font-medium mb-2">Select Stock:</label>
          <select
            id="ticker"
            className="w-full p-2 border rounded-md focus:ring focus:ring-opacity-50"
            value={selectedTicker || ''}
            onChange={(e) => setSelectedTicker(e.target.value)}
          >
            {availableTickers.map(ticker => (
              <option key={ticker} value={ticker}>{ticker}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-6 rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Stock Price Trend</h2>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart 
              data={filteredStockData}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Price']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="close_value" 
                stroke={colors.price} 
                strokeWidth={2}
                name="Stock Price"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-6 rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sentiment Distribution</h2>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={sentimentDistribution}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Posts']} />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Number of Posts"
                radius={[4, 4, 0, 0]}
              >
                {sentimentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#82ca9d'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-6 rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Social Media Post Volume</h2>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={aggregatedSentimentByDay}
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
      </div>
    </div>
  );
};

export default StockSentimentDashboard;