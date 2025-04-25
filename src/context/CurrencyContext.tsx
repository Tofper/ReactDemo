import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

interface CurrencyState {
  coins: number;
  gems: number;
}

interface CurrencyContextType {
  currency: CurrencyState;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{children: ReactNode; initialCoins?: number; initialGems?: number}> = ({
  children,
  initialCoins = 0,
  initialGems = 0
}) => {
  const [currency, setCurrency] = useState<CurrencyState>({
    coins: initialCoins,
    gems: initialGems
  });

  const addCoins = useCallback((amount: number) => {
    setCurrency(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  }, []);

  const addGems = useCallback((amount: number) => {
    setCurrency(prev => ({
      ...prev,
      gems: prev.gems + amount
    }));
  }, []);

  const value = useMemo(() => ({
    currency,
    addCoins,
    addGems
  }), [currency, addCoins, addGems]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};