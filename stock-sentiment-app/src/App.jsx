import React from 'react';
import StockSentimentDashboard from './components/StockSentimentDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-800 p-4 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-700">
          <StockSentimentDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;