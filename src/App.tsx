import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DailyRewardsScreen } from './features/dailyRewards';
import { CurrencyProvider } from './context/CurrencyContext';

const App: React.FC = () => {
  return (
    <CurrencyProvider initialCoins={500} initialGems={50}>
      <Routes>
        <Route path="/" element={<DailyRewardsScreen />} />
      </Routes>
    </CurrencyProvider>
  )
};

export default App;